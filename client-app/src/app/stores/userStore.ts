import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../..";
import agent from "../api/agent";
import { IUser, IUserFormValues } from "../models/user";
import { store } from "./store";

export default class UserStore {
    constructor() {
        makeAutoObservable(this);
    }

    user: IUser | null = null;

    get isLoggedIn() {
        return !!this.user;
    }

    login = async (values: IUserFormValues) => {
        try {
            const user = await agent.Account.login(values);
            store.commonStore.setToken(user.token);
            runInAction(() => {
                this.user = user;
            });
            history.push("/activities");
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    };

    logout = () => {
        store.commonStore.setToken(null);
        window.localStorage.removeItem('jwt');
        this.user = null;
        store.activityStore.activities = new Map();
        store.activityStore.selectedActivity = null;
        history.push("/");
    };

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            runInAction(() => {
                this.user = user;
            });
        } catch (error) {
            throw error;
        }
    };

    register = async (creds: IUserFormValues) => {
        try {
            const user = await agent.Account.register(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => {
                this.user = user;
            });
            history.push(`/activities`);
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    };

    setImage = (image: string) => {
        if (this.user) this.user.image = image;
    };
}
