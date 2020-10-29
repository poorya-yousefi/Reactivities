import React, { useState, useEffect, Fragment } from "react";
import "./styles.css";
import Axios from "axios";
import { IActivity } from "../models/activity";
import { Container, List } from "semantic-ui-react";
import { NavBar } from "../../features/nav/NavBar";

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
                <List>
                    {activities.map((activity) => (
                        <List.Item key={activity.id}>
                            {activity.title}
                        </List.Item>
                    ))}
                </List>
            </Container>
        </Fragment>
    );
};

export default App;
