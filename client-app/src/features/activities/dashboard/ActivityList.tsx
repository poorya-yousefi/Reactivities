import { observer } from "mobx-react-lite";
import React, { Fragment, useContext } from "react";
import { Header, Item, Label, Segment } from "semantic-ui-react";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { ActivityListItem } from "./ActivityListItem";

const ActivityList: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const { activitiesByDate } = rootStore.activityStore;
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
