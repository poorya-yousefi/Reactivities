import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { IActivity } from "../models/activity";
import { IUser, IUserFormValues } from "../models/user";

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.response.use(undefined, (error) => {
    if (error.message === "Network Error" && !error.response) {
        toast.error("Netwok error - make sure API running!");
    }
    const { status, data, config } = error.response;
    if (status === 404) {
        history.push("/notfound");
    }
    if (
        status === 400 &&
        config.method === "get" &&
        data.errors.hasOwnProperty("id")
    ) {
        history.push("/notfound");
    }
    if (status === 500) {
        toast.error("Server error - check terminal for more info!");
    }
    throw error;
});

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};

axios.interceptors.response.use(async (response) => {
    try {
        await sleep(1000);
        return response;
    } catch (error) {
        console.log(error);
        return await Promise.reject(error);
    }
});

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) =>
        axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) =>
        axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Activities = {
    list: (): Promise<IActivity[]> => requests.get("/activities"),
    details: (id: string) => requests.get(`/activities/${id}`),
    create: (activity: IActivity) => requests.post("/activities", activity),
    update: (activity: IActivity) =>
        requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`),
};

const User = {
    current: (): Promise<IUser> => requests.get("/user"),
    login: (user: IUserFormValues): Promise<IUser> =>
        requests.post("/user/login", user),
    register: (user: IUserFormValues): Promise<IUser> =>
        requests.post("/user/register", user),
};

const agent = {
    Activities,
    User,
};
export default agent;
