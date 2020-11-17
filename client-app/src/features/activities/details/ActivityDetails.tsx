import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Button, Card, Image } from "semantic-ui-react";
import ActivityStore from "../../../app/stores/activityStore";

const ActivityDetails: React.FC = () => {
    const activityStore = useContext(ActivityStore);
    const {
        selectedActivity,
        openEditForm,
        cancelSelectedActivity,
    } = activityStore;
    return (
        <Card fluid>
            <Image
                src={`/assets/categoryImages/${selectedActivity!.category}.jpg`}
                wrapped
                ui={false}
            />
            <Card.Content>
                <Card.Header>{selectedActivity!.title}</Card.Header>
                <Card.Meta>
                    <span className="date">{selectedActivity!.date}</span>
                </Card.Meta>
                <Card.Description>
                    {selectedActivity!.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths="2">
                    <Button
                        basic
                        content="Edit"
                        color="blue"
                        onClick={() => {
                            openEditForm(selectedActivity!.id);
                        }}
                    />
                    <Button
                        basic
                        content="Cancel"
                        color="grey"
                        onClick={() => cancelSelectedActivity()}
                    />
                </Button.Group>
            </Card.Content>
        </Card>
    );
};

export default observer(ActivityDetails);
