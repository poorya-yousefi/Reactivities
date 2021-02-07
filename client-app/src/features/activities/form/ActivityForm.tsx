import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Grid, Segment } from "semantic-ui-react";
import { ActivityFormValues } from "../../../app/models/activity";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import ActivityStore from "../../../app/stores/activityStore";
import { RouteComponentProps } from "react-router-dom";
import { Field, Form as FinalForm } from "react-final-form";
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import SelectInput from "../../../app/common/form/SelectInput";
import { category } from "../../../app/common/options/categoryOptions";
import DateInput from "../../../app/common/form/DateInput";
import { combineDateAndTime } from "../../../app/common/util/util";
import {
    combineValidators,
    composeValidators,
    hasLengthGreaterThan,
    isRequired,
} from "revalidate";
import { RootStoreContext } from "../../../app/stores/rootStore";

const validate = combineValidators({
    title: isRequired({ message: "The event title is required" }),
    category: isRequired("category"),
    description: composeValidators(
        isRequired("description"),
        hasLengthGreaterThan(4)({
            message: "Description must be more than 5 chars!",
        })
    )(),
    city: isRequired("city"),
    venue: isRequired("venue"),
    date: isRequired("date"),
    time: isRequired("time"),
});

interface DetailsParam {
    id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailsParam>> = ({
    match,
    history,
}) => {
    const rootStore = useContext(RootStoreContext);
    const {
        createActivity,
        submitting,
        editActivity,
        loadActivity,
    } = rootStore.activityStore;

    const [activity, setActivity] = useState(new ActivityFormValues());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (match.params.id) {
            setLoading(true);
            loadActivity(match.params.id)
                .then((activity) =>
                    setActivity(new ActivityFormValues(activity))
                )
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [loadActivity, match.params.id]);

    const handleSubmitForm = (value: any) => {
        const dateAndTime = combineDateAndTime(value.date, value.time);
        const { date, time, ...activity } = value;
        activity.date = dateAndTime;
        if (!activity.id) {
            let newActivity = {
                ...activity,
                id: uuid(),
            };
            createActivity(newActivity);
        } else {
            editActivity(activity);
        }
    };

    return (
        <Grid>
            <Grid.Column width={10}>
                <Segment clearing>
                    <FinalForm
                        initialValues={activity}
                        onSubmit={handleSubmitForm}
                        validate={validate}
                        render={({ handleSubmit, invalid, pristine }) => (
                            <Form onSubmit={handleSubmit} loading={loading}>
                                <Field
                                    component={TextInput}
                                    name="title"
                                    placeholder="Title"
                                    value={activity.title}
                                />
                                <Field
                                    component={TextAreaInput}
                                    name="description"
                                    rows={3}
                                    placeholder="Description"
                                    value={activity.description}
                                />
                                <Field
                                    component={SelectInput}
                                    options={category}
                                    name="category"
                                    placeholder="Category"
                                    value={activity.category}
                                />
                                <Form.Group widths="equal">
                                    <Field
                                        component={DateInput}
                                        date={true}
                                        name="date"
                                        placeholder="Date"
                                        value={activity.date}
                                    />
                                    <Field
                                        component={DateInput}
                                        time={true}
                                        name="time"
                                        placeholder="Time"
                                        value={activity.time}
                                    />
                                </Form.Group>

                                <Field
                                    component={TextInput}
                                    name="city"
                                    placeholder="City"
                                    value={activity.city}
                                />
                                <Field
                                    component={TextInput}
                                    name="venue"
                                    placeholder="Venue"
                                    value={activity.venue}
                                />
                                <Button
                                    loading={submitting}
                                    disabled={loading || invalid || pristine}
                                    floated="right"
                                    positive
                                    type="submit"
                                    content="Submit"
                                />
                                <Button
                                    onClick={
                                        activity.id
                                            ? () =>
                                                  history.push(
                                                      `/activities/${activity.id}`
                                                  )
                                            : () => history.push("/activities")
                                    }
                                    disabled={loading}
                                    floated="right"
                                    type="button"
                                    content="Cancel"
                                />
                            </Form>
                        )}
                    />
                </Segment>
            </Grid.Column>
        </Grid>
    );
};

export default observer(ActivityForm);
