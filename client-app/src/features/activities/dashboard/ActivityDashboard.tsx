import React from "react";
import { Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { ActivityList } from "./ActivityList";
import { ActivityDetails } from "../details/ActivityDetails";
import { ActivityForm } from "../form/ActivityForm";

interface IProps {
    activities: IActivity[];
    selectActivity: (id: string) => void;
    selectedActivity: IActivity | null;
    isEditMode: boolean;
    setEditMode: (isEditMode: boolean) => void;
    setSelectedActivity: (activity: IActivity | null) => void;
}

export const ActivityDashboard: React.FC<IProps> = ({
    activities,
    selectActivity,
    selectedActivity,
    isEditMode,
    setEditMode,
    setSelectedActivity,
}) => {
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList
                    activities={activities}
                    selectActivity={selectActivity}
                />
            </Grid.Column>
            <Grid.Column width={6}>
                {selectedActivity && !isEditMode && (
                    <ActivityDetails
                        setSelectedActivity={setSelectedActivity}
                        selectedActivity={selectedActivity}
                        setEditMode={setEditMode}
                    />
                )}
                {isEditMode && (
                    <ActivityForm
                        activity={selectedActivity!}
                        setEditMode={setEditMode}
                    />
                )}
            </Grid.Column>
        </Grid>
    );
};
