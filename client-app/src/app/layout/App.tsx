import React, { useState, useEffect, Fragment } from "react";
import "./styles.css";
import Axios from "axios";
import { IActivity } from "../models/activity";
import { Container } from "semantic-ui-react";
import { NavBar } from "../../features/nav/NavBar";
import { ActivityDashboard } from "../../features/activities/dashboard/ActivityDashboard";

const App = () => {
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
        null
    );
    const [isEditMode, setEditMode] = useState(false);

    const handleSelectedActivity = (id: string) => {
        setSelectedActivity(activities.filter((a) => a.id === id)[0]);
    };

    const handleOpenCreateForm = () => {
        setSelectedActivity(null);
        setEditMode(true);
    };

    useEffect(() => {
        Axios.get<IActivity[]>("http://localhost:5000/api/activities").then(
            (response) => {
                setActivities(response.data);
            }
        );
    }, []);

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
                />
            </Container>
        </Fragment>
    );
};

export default App;
