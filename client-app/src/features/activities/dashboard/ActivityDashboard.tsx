import React, { useEffect, useState } from "react";
import { Grid, Loader } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { observer } from "mobx-react-lite";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import ActivityFilters from "./ActivityFilters";
import { useStore } from "../../../app/stores/store";
import InfiniteScroll from "react-infinite-scroller";
import { PagingParams } from "../../../app/models/pagination";

const ActivityDashboard: React.FC = () => {
    const { activityStore } = useStore();
    const {
        loadActivities,
        loadingInitial,
        activities,
        setPagingParams,
        pagination,
    } = activityStore;
    const [loadingNext, setLoadingNext] = useState(false);

    function handleGenNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1));
        loadActivities().then(() => {
            setLoadingNext(false);
        });
    }

    useEffect(() => {
        if (activities.size <= 1) loadActivities();
    }, [activities.size, loadActivities]);

    if (loadingInitial && !loadingNext)
        return <LoadingComponent text={"Activities Loading..."} />;

    return (
        <Grid>
            <Grid.Column width={10}>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={handleGenNext}
                    hasMore={
                        !loadingNext &&
                        !!pagination &&
                        pagination.currentPage < pagination.totalPages
                    }
                    initialLoad={false}
                >
                    <ActivityList />
                </InfiniteScroll>
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityFilters />
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loadingNext} />
            </Grid.Column>
        </Grid>
    );
};

export default observer(ActivityDashboard);
