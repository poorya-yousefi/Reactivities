import {
    action,
    computed,
    makeObservable,
    observable,
    configure,
    runInAction,
} from "mobx";
import { createContext, SyntheticEvent } from "react";
import agent from "../api/agent";
import { IActivity } from "../models/activity";

configure({ enforceActions: "always" });

class ActivityStore {
    @observable activities = new Map();
    @observable activity: IActivity | null = null;
    @observable loadingInitial = false;
    @observable submitting = false;
    @observable target = "";

    @computed get activitiesByDate() {
        return this.groupActivitiesByDate(Array.from(this.activities.values()));
    }

    groupActivitiesByDate(activities: IActivity[]) {
        const sortedActivities = activities.sort(
            (a, b) => Date.parse(a.date) - Date.parse(b.date)
        );
        return Object.entries(
            sortedActivities.reduce((activities, activity) => {
                const date = activity.date.split("T")[0];
                activities[date] = activities[date]
                    ? [...activities[date], activity]
                    : [activity];
                return activities;
            }, {} as { [key: string]: IActivity[] })
        );
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction(() => {
                activities.forEach((acv) => {
                    acv.date = acv.date.split(".")[0];
                    this.activities.set(acv.id, acv);
                });
                this.loadingInitial = false;
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loadingInitial = false;
            });
        }
    };

    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.activity = activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction(() => {
                    this.activity = activity;
                });
            } catch (error) {
                console.log(error);
            } finally {
                runInAction(() => {
                    this.loadingInitial = false;
                });
            }
        }
    };

    getActivity = (id: string) => {
        return this.activities.get(id);
    };

    @action clearActivity = () => {
        this.activity = null;
    };

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activities.set(activity.id, activity);
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.submitting = false;
            });
        }
    };

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activities.set(activity.id, activity);
                this.activity = activity;
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.submitting = false;
            });
        }
    };

    @action deleteActivity = async (
        event: SyntheticEvent<HTMLButtonElement>,
        id: string
    ) => {
        this.target = event.currentTarget.name;
        this.submitting = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activities.delete(id);
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.target = "";
                this.submitting = false;
            });
        }
    };

    constructor() {
        makeObservable(this);
    }
}

export default createContext(new ActivityStore());
