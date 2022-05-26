import React from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { format } from "date-fns";
import ActivityListItemAttendee from "./ActivityListItemAttendee";

export const ActivityListItem: React.FC<{ activity: Activity }> = ({
    activity,
}) => {
    return (
        <Segment.Group>
            <Segment>
                {activity.isCancelled && (
                    <Label
                        attached="top"
                        color="red"
                        content="Cancelled"
                        style={{ textAlign: "center" }}
                    />
                )}
                <Item.Group>
                    <Item>
                        <Item.Image
                            style={{ marginBottom: 3 }}
                            size="tiny"
                            circular
                            src={activity.host?.image || "/assets/user.png"}
                        />
                        <Item.Content>
                            <Item.Header as="a">{activity.title}</Item.Header>
                            <Item.Description>
                                Hosted by{" "}
                                <Link
                                    to={`/profiles/${activity.host?.userName}`}
                                >
                                    {activity.host?.displayName}
                                </Link>
                            </Item.Description>
                            {activity.isHost && (
                                <Item.Description>
                                    <Label basic color="orange">
                                        You are hosting this activity
                                    </Label>
                                </Item.Description>
                            )}
                            {activity.isGoing && !activity.isHost && (
                                <Item.Description>
                                    <Label basic color="green">
                                        You are going to this activity
                                    </Label>
                                </Item.Description>
                            )}
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <Icon name="clock" /> {format(activity.date!, "h:mm a")}
                <Icon name="marker" /> {activity.venue}, {activity.city}
            </Segment>
            <Segment secondary>
                <ActivityListItemAttendee attendees={activity.attendees!} />
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button
                    as={Link}
                    to={`/activities/${activity.id}`}
                    floated="right"
                    content="View"
                    color="blue"
                />
            </Segment>
        </Segment.Group>
    );
};
