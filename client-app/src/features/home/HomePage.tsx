import React from "react";
import { Container, Segment, Header, Button, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import LoginForm from "../user/LoginForm";
import RegisterForm from "../user/RegisterForm";

export default observer(function HomePage() {
    const { userStore, modalStore } = useStore();
    return (
        <Segment inverted textAlign="center" vertical className="masthead">
            <Container text>
                <Header as="h1" inverted>
                    <Image
                        size="massive"
                        src="/assets/logo.png"
                        alt="logo"
                        style={{ marginBottom: 12 }}
                    />
                    Reactivities
                </Header>
                {userStore.isLoggedIn ? (
                    <>
                        <Header
                            as="h2"
                            inverted
                            content="Welcome to Reactivities"
                        />
                        <Button as={Link} to="/activities" size="huge" inverted>
                            Go to Activities
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            onClick={() => {
                                modalStore.openModal(<LoginForm />);
                            }}
                            size="huge"
                            inverted
                        >
                            Login
                        </Button>
                        <Button
                            onClick={() => {
                                modalStore.openModal(<RegisterForm />);
                            }}
                            size="huge"
                            inverted
                        >
                            Register
                        </Button>
                    </>
                )}
            </Container>
        </Segment>
    );
});
