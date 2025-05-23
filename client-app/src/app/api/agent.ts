import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { Activity, ActivityFormValues } from "../models/activity";
import { Photo, Profile } from "../models/profile";
import { IUser, IUserFormValues } from "../models/user";
import { store } from "../stores/store";
import { PaginationResult } from "../models/pagination";

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.request.use((config) => {
    const token = store.commonStore.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};

axios.interceptors.response.use(
    async (response) => {
        await sleep(1000);
        const pagination = response.headers.pagination;
        if (pagination) {
            response.data = new PaginationResult(
                response.data,
                JSON.parse(pagination)
            );
            return response as AxiosResponse<PaginationResult<any>>;
        }
        return response;
    },
    (error: AxiosError) => {
        if (error.message === "Network Error" && !error.response) {
            toast.error("Netwok error - make sure API running!");
        }
        const { data, status, config } = error.response!;
        switch (status) {
            case 400:
                if (typeof data === "string") {
                    toast.error("Bad Request >> " + data);
                }
                if (
                    config.method === "get" &&
                    data.errors.hasOwnProperty("id")
                ) {
                    history.push("/not-found");
                }
                if (data.errors) {
                    const modalStateErrors = [];
                    for (const key in data.errors) {
                        if (data.errors[key]) {
                            modalStateErrors.push(data.errors[key]);
                        }
                    }
                    throw modalStateErrors.flat();
                }
                break;
            case 401:
                toast.error("Unauthorized");
                store.userStore.logout();
                break;
            case 404:
                history.push("/not-found");
                break;
            case 500:
                store.commonStore.setServerError(data);
                history.push("/server-error");
                break;
            default:
                toast.error("UNKNOWN ERROR");
                break;
        }
    }
);

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) =>
        axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) =>
        axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Activities = {
    list: (params: URLSearchParams): Promise<PaginationResult<Activity[]>> =>
        axios.get("/activities", { params }).then(responseBody),
    details: (id: string): Promise<Activity> =>
        requests.get(`/activities/${id}`),
    create: (activity: ActivityFormValues) =>
        requests.post("/activities", activity),
    update: (activity: ActivityFormValues) =>
        requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`),
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {}),
};

const Account = {
    current: (): Promise<IUser> => requests.get<IUser>("/account"),
    login: (user: IUserFormValues) =>
        requests.post<IUser>("/account/login", user),
    register: (user: IUserFormValues) =>
        requests.post<IUser>("/account/register", user),
};

const Profiles = {
    get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
    uploadPhoto: (file: Blob) => {
        let formData = new FormData();
        formData.append("ImageFile", file);
        return axios.post<Photo>("/photos", formData, {
            headers: { "Content-type": "multipart/form-data" },
        });
    },
    setMainPhoto: (id: string) => requests.post(`/photos/${id}/setmain`, {}),
    deletePhoto: (id: string) => requests.del(`/photos/${id}`),
    updateFollowing: (username: string) =>
        requests.post(`/follow/${username}`, {}),
    listFollowings: (username: string, predicate: string) =>
        requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
};

const agent = {
    Activities,
    Account,
    Profiles,
};
export default agent;
