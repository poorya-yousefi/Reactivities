import React, { useState, useEffect, Fragment } from "react";
import "./styles.css";
import Axios from "axios";
import { IActivity } from "../models/activity";
import { Container } from "semantic-ui-react";
import { NavBar } from "../../features/nav/NavBar";
import { ActivityDashboard } from "../../features/activities/dashboard/ActivityDashboard";

const App = () => {
    const [activities, setActivities] = useState<IActivity[]>([]);

    useEffect(() => {
        Axios.get<IActivity[]>("http://localhost:5000/api/activities").then(
            (response) => {
                setActivities(response.data);
            }
        );
    }, []);

    return (
        <Fragment>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
                <ActivityDashboard activities={activities} />
            </Container>
        </Fragment>
    );
};

export default App;
