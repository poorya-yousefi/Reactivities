import React from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";

interface IProps {
    activities: IActivity[];
    selectActivity: (id: string) => void;
}

export const ActivityList: React.FC<IProps> = ({
    activities,
    selectActivity,
}) => {
    return (
        <Segment clearing>
            <Item.Group divided>
                {activities.map((activity) => (
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
                                    floated="right"
                                    onClick={() => {
                                        selectActivity(activity.id);
                                    }}
                                >
                                    View
                                </Button>
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    );
};
