import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { Image, List, Popup } from "semantic-ui-react";
import { Profile } from "../../../app/models/profile";
import ProfileCard from "../../profile/ProfileCard";

interface Props {
    attendees: Profile[];
}

export default observer(function ActivityListItemAttendee({
    attendees,
}: Props) {
    const styles = {
        borderColor: "orange",
        borderWidth: 2,
    };

    return (
        <List horizontal>
            {attendees.map((attendee) => (
                <Popup
                    hoverable
                    key={attendee.userName}
                    trigger={
                        <List.Item
                            key={attendee.userName}
                            as={Link}
                            to={`/profiles/${attendee.userName}`}
                        >
                            <Image
                                size="mini"
                                circular
                                src={attendee.image || "/assets/user.png"}
                                bordered
                                style={attendee.following ? styles : null}
                            />
                        </List.Item>
                    }
                >
                    <Popup.Content>
                        <ProfileCard profile={attendee} />
                    </Popup.Content>
                </Popup>
            ))}
        </List>
    );
});
