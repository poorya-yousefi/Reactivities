import React, { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { observer } from "mobx-react-lite";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import ActivityFilters from "./ActivityFilters";
import { useStore } from "../../../app/stores/store";

const ActivityDashboard: React.FC = () => {
    const { activityStore } = useStore();
    const { loadActivities, loadingInitial, activities } = activityStore;

    useEffect(() => {
        if (activities.size <= 1) loadActivities();
    }, [activities.size, loadActivities]);

    if (loadingInitial)
        return <LoadingComponent text={"Activities Loading..."} />;

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityFilters />
            </Grid.Column>
        </Grid>
    );
};

export default observer(ActivityDashboard);
