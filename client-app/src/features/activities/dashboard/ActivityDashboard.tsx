import React, { SyntheticEvent } from "react";
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
    createActivity: (activity: IActivity) => void;
    editActivity: (activity: IActivity) => void;
    deleteActivity: (
        event: SyntheticEvent<HTMLButtonElement>,
        id: string
    ) => void;
    submitting: boolean;
    btnTargetId: string;
}

export const ActivityDashboard: React.FC<IProps> = ({
    activities,
    selectActivity,
    selectedActivity,
    isEditMode,
    setEditMode,
    setSelectedActivity,
    createActivity,
    editActivity,
    deleteActivity,
    submitting,
    btnTargetId,
}) => {
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList
                    activities={activities}
                    selectActivity={selectActivity}
                    deleteActivity={deleteActivity}
                    submitting={submitting}
                    target={btnTargetId}
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
                        key={(selectedActivity && selectedActivity.id) || 0}
                        activity={selectedActivity!}
                        setEditMode={setEditMode}
                        createActivity={createActivity}
                        editActivity={editActivity}
                        submitting={submitting}
                    />
                )}
            </Grid.Column>
        </Grid>
    );
};
