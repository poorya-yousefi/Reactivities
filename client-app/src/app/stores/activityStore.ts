import { action, computed, makeObservable, observable, configure } from "mobx";
import { createContext, SyntheticEvent } from "react";
import agent from "../api/agent";
import { IActivity } from "../models/activity";

configure({ enforceActions: "always" });

class ActivityStore {
    @observable activities = new Map();
    @observable selectedActivity: IActivity | undefined;
    @observable loadingInitial = false;
    @observable editMode = false;
    @observable submitting = false;
    @observable target = "";

    @computed get activitiesByDate() {
        return Array.from(this.activities.values()).sort(
            (a, b) => Date.parse(a.date) - Date.parse(b.date)
        );
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.activities.list();
            activities.forEach((acv) => {
                acv.date = acv.date.split(".")[0];
                this.activities.set(acv.id, acv);
            });
        } catch (error) {
            console.log(error);
        } finally {
            this.loadingInitial = false;
        }
    };

    @action selectActivity = (id: string) => {
        this.selectedActivity = this.activities.get(id);
        this.editMode = false;
    };

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.activities.create(activity);
            this.activities.set(activity.id, activity);
            this.selectedActivity = undefined;
            this.editMode = false;
        } catch (error) {
            console.log(error);
        } finally {
            this.submitting = false;
        }
    };

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.activities.update(activity);
            this.activities.set(activity.id, activity);
            this.selectedActivity = activity;
            this.editMode = false;
        } catch (error) {
            console.log(error);
        } finally {
            this.submitting = false;
        }
    };

    @action deleteActivity = async (
        event: SyntheticEvent<HTMLButtonElement>,
        id: string
    ) => {
        this.target = event.currentTarget.name;
        this.submitting = true;
        try {
            await agent.activities.delete(id);
            this.activities.delete(id);
        } catch (error) {
            console.log(error);
        } finally {
            this.target = "";
            this.submitting = false;
        }
    };

    @action openCreateForm = () => {
        this.selectedActivity = undefined;
        this.editMode = true;
    };

    @action openEditForm = (id: string) => {
        this.selectedActivity = this.activities.get(id);
        this.editMode = true;
    };

    @action cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    };

    @action cancelFromOpen = () => {
        this.editMode = false;
    };

    constructor() {
        makeObservable(this);
    }
}

export default createContext(new ActivityStore());
