import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { Button, Header, Label } from "semantic-ui-react";
import MyTextInput from "../../app/common/form/MyTextInput";
import { useStore } from "../../app/stores/store";

export default observer(function LoginForm() {
    const { userStore } = useStore();
    const { login } = userStore;

    return (
        <div>
            <Formik
                initialValues={{ email: "", password: "", error: null }}
                onSubmit={(vals, { setErrors }) =>
                    login(vals).catch(() =>
                        setErrors({
                            error: "Invalid email or password",
                        })
                    )
                }
            >
                {({ handleSubmit, isSubmitting, errors }) => (
                    <Form
                        className="ui form"
                        onSubmit={handleSubmit}
                        autoComplete="off"
                    >
                        <Header
                            as="h2"
                            content="Login to Reactivities"
                            color="teal"
                            textAlign="center"
                        />
                        <MyTextInput
                            name="email"
                            placeholder="Email"
                            type="email"
                        />
                        <MyTextInput
                            name="password"
                            placeholder="Password"
                            type="password"
                        />
                        <ErrorMessage
                            name="error"
                            render={() => (
                                <Label
                                    style={{ marginBottom: 10 }}
                                    basic
                                    color="red"
                                    content={errors.error}
                                />
                            )}
                        />
                        <Button
                            loading={isSubmitting}
                            positive
                            type="submit"
                            content="Submit"
                            fluid
                        />
                    </Form>
                )}
            </Formik>
        </div>
    );
});
