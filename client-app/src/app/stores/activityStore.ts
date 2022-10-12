import { makeAutoObservable, runInAction } from "mobx";
import { SyntheticEvent } from "react";
import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../models/activity";
import { history } from "../..";
import { store } from "./store";
import { Profile } from "../models/profile";

export default class ActivityStore {
    constructor() {
        makeAutoObservable(this);
    }

    activities = new Map<string, Activity>();
    selectedActivity: Activity | null = null;
    loadingInitial = false;
    submitting = false;
    target = "";

    get activitiesByDate() {
        return this.groupActivitiesByDate(Array.from(this.activities.values()));
    }

    groupActivitiesByDate(activities: Activity[]) {
        const sortedActivities = activities.sort(
            (a, b) => a.date!.getTime() - b.date!.getTime()
        );
        return Object.entries(
            sortedActivities.reduce((activities, activity) => {
                const date = activity.date!.toISOString().split("T")[0];
                activities[date] = activities[date]
                    ? [...activities[date], activity]
                    : [activity];
                return activities;
            }, {} as { [key: string]: Activity[] })
        );
    }

    loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction(() => {
                activities.forEach((acv) => {
                    this.setActivity(acv);
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
            this.selectedActivity = activity;
            return activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => {
                    this.selectedActivity = activity!;
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

    private setActivity = (activity: Activity) => {
        const user = store.userStore.user;
        if (user) {
            activity.isGoing = activity.attendees?.some(
                (a) => a.userName === user.username
            );
            activity.isHost = activity.hostUserName === user.username;
            activity.host = activity.attendees?.find(
                (a) => a.userName === activity.hostUserName
            );
        }
        activity.date = new Date(activity.date!);
        this.activities.set(activity.id, activity);
    };

    getActivity = (id: string) => {
        return this.activities.get(id);
    };

    // @action clearActivity = () => {
    //     this.activity = null;
    // };

    createActivity = async (activity: ActivityFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!);
        try {
            await agent.Activities.create(activity);
            const newActivity = new Activity(activity);
            newActivity.hostUserName = user?.username!;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);
            runInAction(() => {
                this.selectedActivity = newActivity;
            });
            history.push(`/activities/${activity.id}`);
        } catch (error) {
            console.log(error);
        }
    };

    editActivity = async (activity: ActivityFormValues) => {
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                if (activity.id) {
                    let updatedActivity = {
                        ...this.getActivity(activity.id),
                        ...activity,
                    };
                    this.activities.set(activity.id, updatedActivity as Activity);
                    this.selectedActivity = updatedActivity as Activity;
                }
            });
            history.push(`/activities/${activity.id}`);
        } catch (error) {
            console.log(error);
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

    updateAttendance = async () => {
        const user = store.userStore.user;
        this.submitting = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if (this.selectedActivity?.isGoing) {
                    this.selectedActivity.attendees =
                        this.selectedActivity.attendees?.filter(
                            (a) => a.userName !== user?.username
                        );
                    this.selectedActivity.isGoing = false;
                } else {
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
                this.activities.set(
                    this.selectedActivity!.id,
                    this.selectedActivity!
                );
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => (this.submitting = false));
        }
    };

    cancelActivityToggle = async () => {
        this.submitting = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                this.selectedActivity!.isCancelled =
                    !this.selectedActivity?.isCancelled;
                this.activities.set(
                    this.selectedActivity!.id,
                    this.selectedActivity!
                );
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.submitting = false;
            });
        }
    };

    clearSelectedActiviy = () => {
        this.selectedActivity = null;
    }

    updateAttendeeFollowing = (username: string) => {
        this.activities.forEach(activity => {
            activity.attendees.forEach(attendee => {
                if (attendee.userName === username) {
                    attendee.following ? attendee.followersCount-- : attendee.followersCount++;
                    attendee.following = !attendee.following;
                }
            })
        })
    }
}
