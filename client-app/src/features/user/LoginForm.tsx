import React from "react";
import { Field, Form as FinalForm } from "react-final-form";
import { Button, Form } from "semantic-ui-react";
import TextInput from "../../app/common/form/TextInput";
import { IUserFormValues } from "../../app/models/user";
import { useStore } from "../../app/stores/store";

export const LoginForm = () => {
    const { userStore } = useStore();
    const { login } = userStore;

    return (
        <div>
            <FinalForm
                onSubmit={(vals: IUserFormValues) => {
                    login(vals);
                }}
                render={({ handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <Field
                            name="email"
                            component={TextInput}
                            placeholder="Email"
                            type="email"
                        />
                        <Field
                            name="password"
                            component={TextInput}
                            placeholder="Password"
                            type="password"
                        />
                        <Button positive type="submit" content="Submit" />
                    </Form>
                )}
            />
        </div>
    );
};
