import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import ActivityStore from "../../../app/stores/activityStore";

const ActivityList: React.FC = () => {
    const activityStore = useContext(ActivityStore);
    const {
        activitiesByDate,
        submitting,
        deleteActivity,
        target,
    } = activityStore;
    return (
        <Segment clearing>
            <Item.Group divided>
                {activitiesByDate.map((activity) => (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as="a">{activity.title}</Item.Header>
                            <Item.Meta>
                                <span>{activity.date}</span>
                            </Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Label basic>{activity.category}</Label>
                                <Button
                                    primary
                                    content="View"
                                    floated="right"
                                    as={Link}
                                    to={`/activities/${activity.id}`}
                                />
                                <Button
                                    name={activity.id}
                                    loading={
                                        target === activity.id && submitting
                                    }
                                    color="red"
                                    floated="right"
                                    content="Delete"
                                    onClick={(e) => {
                                        deleteActivity(e, activity.id);
                                    }}
                                />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    );
};

export default observer(ActivityList);
