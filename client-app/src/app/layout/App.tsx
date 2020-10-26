import React, { useState, useEffect } from "react";
import "./styles.css";
import Axios from "axios";
import { IActivity } from "../models/activity";
import { Header, Icon, List } from "semantic-ui-react";

const App = () => {
    const [activities, setActivities] = useState<IActivity[]>([]);

    useEffect(() => {
        Axios.get<IActivity[]>("http://localhost:5000/api/activities").then(
            (response) => {
                setActivities(response.data);
            }
        );
    }, []);
    // componentDidMount() {
    //     Axios.get<IActivity[]>("http://localhost:5000/api/activities").then((response) => {
    //         this.setState({
    //             activities: response.data,
    //         });
    //     });
    // }

    return (
        <div>
            <Header as="h2">
                <Icon name="users" />
                <Header.Content>Reactivities</Header.Content>
            </Header>
            <List>
                {activities.map((activity) => (
                    <List.Item key={activity.id}>{activity.title}</List.Item>
                ))}
            </List>
        </div>
    );
};

export default App;
