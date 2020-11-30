import React, { FormEvent, useContext, useEffect, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import ActivityStore from "../../../app/stores/activityStore";
import { RouteComponentProps } from "react-router-dom";

interface DetailsParam {
    id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailsParam>> = ({
    match,
    history,
}) => {
    const activityStore = useContext(ActivityStore);
    const {
        createActivity,
        submitting,
        editActivity,
        activity: initialFormState,
        loadActivity,
        clearActivity,
    } = activityStore;

    const [activity, setActivity] = useState<IActivity>({
        id: "",
        title: "",
        category: "",
        description: "",
        date: "",
        city: "",
        venue: "",
    });

    useEffect(() => {
        if (match.params.id && activity.id.length === 0) {
            loadActivity(match.params.id).then(
                () => initialFormState && setActivity(initialFormState)
            );
        }

        return () => clearActivity();
    }, [
        clearActivity,
        loadActivity,
        activity.id.length,
        match.params.id,
        initialFormState,
    ]);

    const handleInputChange = (
        event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.currentTarget;
        setActivity({ ...activity, [name]: value });
    };

    const handleSubmit = () => {
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid(),
            };
            createActivity(newActivity).then(() =>
                history.push(`/activities/${newActivity.id}`)
            );
        } else {
            editActivity(activity).then(() =>
                history.push(`/activities/${activity.id}`)
            );
        }
    };

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input
                    onChange={handleInputChange}
                    name="title"
                    placeholder="Title"
                    value={activity.title}
                />
                <Form.TextArea
                    onChange={handleInputChange}
                    name="description"
                    rows={2}
                    placeholder="Description"
                    value={activity.description}
                />
                <Form.Input
                    onChange={handleInputChange}
                    name="category"
                    placeholder="Cateogory"
                    value={activity.category}
                />
                <Form.Input
                    onChange={handleInputChange}
                    name="date"
                    placeholder="Date"
                    type="datetime-local"
                    value={activity.date}
                />
                <Form.Input
                    onChange={handleInputChange}
                    name="city"
                    placeholder="City"
                    value={activity.city}
                />
                <Form.Input
                    onChange={handleInputChange}
                    name="venue"
                    placeholder="Venue"
                    value={activity.venue}
                />
                <Button
                    loading={submitting}
                    content="Submit"
                    type="submit"
                    floated="right"
                    positive
                />
                <Button
                    content="Cancel"
                    floated="right"
                    color="grey"
                    onClick={() => history.push(`/activities/${activity.id}`)}
                />
            </Form>
        </Segment>
    );
};

export default observer(ActivityForm);
