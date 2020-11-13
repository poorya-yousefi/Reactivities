import React, { useState, useEffect, Fragment, SyntheticEvent } from "react";
import "./styles.css";
import { IActivity } from "../models/activity";
import { Container } from "semantic-ui-react";
import { NavBar } from "../../features/nav/NavBar";
import { ActivityDashboard } from "../../features/activities/dashboard/ActivityDashboard";
import agent from "../api/agent";
import { LoadingComponent } from "./LoadingComponent";

const App = () => {
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
        null
    );
    const [isEditMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [target, setTarget] = useState("");

    const handleSelectedActivity = (id: string) => {
        setSelectedActivity(activities.filter((a) => a.id === id)[0]);
        setEditMode(false);
    };

    const handleOpenCreateForm = () => {
        setSelectedActivity(null);
        setEditMode(true);
    };

    const handleCreateActivity = (activity: IActivity) => {
        setSubmitting(true);
        agent.activities
            .create(activity)
            .then(() => {
                setActivities([...activities, activity]);
                setSelectedActivity(activity);
                setEditMode(false);
            })
            .then(() => {
                setSubmitting(false);
            });
    };

    const handleEditActivity = (activity: IActivity) => {
        setSubmitting(true);
        agent.activities
            .update(activity)
            .then(() => {
                setActivities([
                    ...activities.filter((a) => a.id !== activity.id),
                    activity,
                ]);
                setSelectedActivity(activity);
                setEditMode(false);
            })
            .then(() => {
                setSubmitting(false);
            });
    };

    const handleDeleteActivity = (
        event: SyntheticEvent<HTMLButtonElement>,
        id: string
    ) => {
        setTarget(event.currentTarget.name);
        setSubmitting(true);
        agent.activities
            .delete(id)
            .then(() => {
                setActivities(activities.filter((a) => a.id !== id));
            })
            .then(() => {
                setSubmitting(false);
            });
    };

    useEffect(() => {
        setLoading(true);
        agent.activities
            .list()
            .then((response) => {
                let activityList: IActivity[] = [];
                response.forEach((acv) => {
                    acv.date = acv.date.split(".")[0];
                    activityList.push(acv);
                });
                setActivities(activityList);
            })
            .then(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <LoadingComponent text={"Activities Loading..."} />;

    return (
        <Fragment>
            <NavBar openCreateForm={handleOpenCreateForm} />
            <Container style={{ marginTop: "7em" }}>
                <ActivityDashboard
                    activities={activities}
                    selectActivity={handleSelectedActivity}
                    selectedActivity={selectedActivity}
                    isEditMode={isEditMode}
                    setEditMode={setEditMode}
                    setSelectedActivity={setSelectedActivity}
                    createActivity={handleCreateActivity}
                    editActivity={handleEditActivity}
                    deleteActivity={handleDeleteActivity}
                    submitting={submitting}
                    btnTargetId={target}
                />
            </Container>
        </Fragment>
    );
};

export default App;
