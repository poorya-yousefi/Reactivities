import React, { useState, useEffect } from "react";
import "./styles.css";
import Axios from "axios";
import { IActivity } from "../models/activity";
import { List } from "semantic-ui-react";
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
        <div>
            <NavBar />
            <List>
                {activities.map((activity) => (
                    <List.Item key={activity.id}>{activity.title}</List.Item>
                ))}
            </List>
        </div>
    );
};

export default App;
