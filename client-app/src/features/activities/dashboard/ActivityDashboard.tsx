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
}

export const ActivityDashboard: React.FC<IProps> = ({
    activities,
    selectActivity,
    selectedActivity,
    isEditMode,
    setEditMode,
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
                        selectedActivity={selectedActivity}
                        setEditMode={setEditMode}
                    />
                )}
                {isEditMode && <ActivityForm />}
            </Grid.Column>
        </Grid>
    );
};
