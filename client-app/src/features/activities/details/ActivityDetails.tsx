import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedSidebar from "./ActivityDetailedSidebar";

interface DetailsParam {
    id: string;
}

const ActivityDetails: React.FC<RouteComponentProps<DetailsParam>> = ({
    match,
}) => {
    const { activityStore } = useStore();
    const {
        selectedActivity: activity,
        loadActivity,
        loadingInitial,
        clearSelectedActiviy,
    } = activityStore;

    useEffect(() => {
        loadActivity(match.params.id);
        return () => clearSelectedActiviy();
    }, [loadActivity, match.params.id, clearSelectedActiviy]);

    if (loadingInitial) return <LoadingComponent text="Loading activity..." />;

    if (!activity) return <h2>Activity not found from details</h2>;

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={activity} />
                <ActivityDetailedInfo activity={activity} />
                <ActivityDetailedChat activityId={activity.id} />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSidebar activity={activity} />
            </Grid.Column>
        </Grid>
    );
};

export default observer(ActivityDetails);
