import { makeAutoObservable, runInAction } from "mobx";
import { SyntheticEvent } from "react";
import agent from "../api/agent";
import { IActivity } from "../models/activity";
import { history } from "../..";

export default class ActivityStore {
    constructor() {
        makeAutoObservable(this);
    }

    activities = new Map();
    activity: IActivity | null = null;
    loadingInitial = false;
    submitting = false;
    target = "";

    get activitiesByDate() {
        return this.groupActivitiesByDate(Array.from(this.activities.values()));
    }

    groupActivitiesByDate(activities: IActivity[]) {
        const sortedActivities = activities.sort(
            (a, b) => a.date!.getTime() - b.date!.getTime()
        );
        return Object.entries(
            sortedActivities.reduce((activities, activity) => {
                const date = activity.date.toISOString().split("T")[0];
                activities[date] = activities[date]
                    ? [...activities[date], activity]
                    : [activity];
                return activities;
            }, {} as { [key: string]: IActivity[] })
        );
    }

    loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction(() => {
                activities.forEach((acv) => {
                    acv.date = new Date(acv.date!);
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

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.activity = activity;
            return activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction(() => {
                    activity.date = new Date(activity.date);
                    this.activity = activity;
                    this.activities.set(activity.id, activity);
                });
                return activity;
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

    // @action clearActivity = () => {
    //     this.activity = null;
    // };

    createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activities.set(activity.id, activity);
            });
            history.push(`/activities/${activity.id}`);
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.submitting = false;
            });
        }
    };

    editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activities.set(activity.id, activity);
                this.activity = activity;
            });
            history.push(`/activities/${activity.id}`);
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.submitting = false;
            });
        }
    };

    deleteActivity = async (
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
}
