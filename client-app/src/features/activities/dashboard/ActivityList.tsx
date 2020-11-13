import React, { SyntheticEvent } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";

interface IProps {
    activities: IActivity[];
    selectActivity: (id: string) => void;
    deleteActivity: (
        event: SyntheticEvent<HTMLButtonElement>,
        id: string
    ) => void;
    submitting: boolean;
    target: string;
}

export const ActivityList: React.FC<IProps> = ({
    activities,
    selectActivity,
    deleteActivity,
    submitting,
    target,
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
