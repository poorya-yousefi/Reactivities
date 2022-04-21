import React from "react";
import { Segment, Item, Header, Button, Image, Label } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useStore } from "../../../app/stores/store";

const activityImageStyle = {
    filter: "brightness(30%)",
};

const activityImageTextStyle = {
    position: "absolute",
    bottom: "5%",
    left: "5%",
    width: "100%",
    height: "auto",
    color: "white",
};

const ActivityDetailedHeader: React.FC<{ activity: Activity }> = ({
    activity,
}) => {
    const {
        activityStore: { updateAttendance, submitting, cancelActivityToggle },
    } = useStore();
    return (
        <Segment.Group>
            <Segment basic attached="top" style={{ padding: "0" }}>
                {activity.isCancelled && (
                    <Label
                        style={{
                            position: "absolute",
                            zIndex: 1000,
                            left: -14,
                            top: 20,
                        }}
                        ribbon
                        color="red"
                        content="Cancelled"
                    />
                )}
                <Image
                    src={`/assets/categoryImages/${activity.category}.jpg`}
                    fluid
                    style={activityImageStyle}
                />
                <Segment style={activityImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size="huge"
                                    content={activity.title}
                                    style={{ color: "white" }}
                                />
                                <p>{format(activity.date!, "eeee do MMMM")}</p>
                                <p>
                                    Hosted by{" "}
                                    <strong>
                                        <Link
                                            to={`/profiles/${activity.host?.userName}`}
                                        >
                                            {activity.host?.displayName}
                                        </Link>
                                    </strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached="bottom">
                {activity.isHost ? (
                    <>
                        <Button
                            color={activity.isCancelled ? "green" : "red"}
                            floated="left"
                            basic
                            content={
                                activity.isCancelled
                                    ? "Re-activate Activity"
                                    : "Cancel Activity"
                            }
                            onClick={cancelActivityToggle}
                            loading={submitting}
                        />
                        <Button
                            as={Link}
                            disabled={activity.isCancelled}
                            to={`/manage/${activity.id}`}
                            color="orange"
                            floated="right"
                        >
                            Manage Event
                        </Button>
                    </>
                ) : activity.isGoing ? (
                    <Button loading={submitting} onClick={updateAttendance}>
                        Cancel attendance
                    </Button>
                ) : (
                    <Button
                        disabled={activity.isCancelled}
                        loading={submitting}
                        onClick={updateAttendance}
                        color="teal"
                    >
                        Join Activity
                    </Button>
                )}
            </Segment>
        </Segment.Group>
    );
};

export default observer(ActivityDetailedHeader);
