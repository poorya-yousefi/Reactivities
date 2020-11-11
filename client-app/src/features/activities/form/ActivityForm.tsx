import React, { useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";

interface IProps {
    activity: IActivity;
    setEditMode: (isEditMode: boolean) => void;
}

export const ActivityForm: React.FC<IProps> = ({
    activity: initialFormState,
    setEditMode,
}) => {
    const initilizeForm = () => {
        if (initialFormState) {
            return initialFormState;
        } else {
            return {
                id: "",
                title: "",
                category: "",
                description: "",
                date: "",
                city: "",
                venue: "",
            };
        }
    };

    const [activity, setActivity] = useState<IActivity>(initilizeForm);

    return (
        <Segment clearing>
            <Form>
                <Form.Input placeholder="Title" value={activity.title} />
                <Form.TextArea
                    rows={2}
                    placeholder="Description"
                    value={activity.description}
                />
                <Form.Input placeholder="Cateogory" value={activity.category} />
                <Form.Input
                    placeholder="Date"
                    type="Date"
                    value={activity.date}
                />
                <Form.Input placeholder="City" value={activity.city} />
                <Form.Input placeholder="Venue" value={activity.venue} />
                <Button
                    content="Submit"
                    type="submit"
                    floated="right"
                    positive
                />
                <Button
                    content="Cancel"
                    floated="right"
                    color="grey"
                    onClick={() => setEditMode(false)}
                />
            </Form>
        </Segment>
    );
};
