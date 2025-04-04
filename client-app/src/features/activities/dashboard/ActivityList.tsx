import { observer } from "mobx-react-lite";
import React, { Fragment } from "react";
import { Header, Item, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { ActivityListItem } from "./ActivityListItem";

const ActivityList: React.FC = () => {
    const { activityStore } = useStore();
    const { activitiesByDate } = activityStore;
    return (
        <Fragment>
            {activitiesByDate.map(([group, activities]) => (
                <Fragment key={group}>
                    <Header sub color="teal">
                        {group}
                    </Header>
                    <Segment clearing>
                        <Item.Group divided>
                            {activities.map((activity) => (
                                <ActivityListItem
                                    key={activity.id}
                                    activity={activity}
                                />
                            ))}
                        </Item.Group>
                    </Segment>
                </Fragment>
            ))}
        </Fragment>
    );
};

export default observer(ActivityList);
