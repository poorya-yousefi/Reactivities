import React, { Fragment, useEffect } from "react";
import "./styles.css";
import { Container } from "semantic-ui-react";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import {
    Route,
    RouteComponentProps,
    Switch,
    withRouter,
} from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import ActivityForm2 from "../../features/activities/form/ActivityForm2";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import NotFound from "./NotFound";
import { ToastContainer } from "react-toastify";
import LoginForm from "../../features/user/LoginForm";
import TestErrors from "../../features/errors/TestError";
import ServerError from "../../features/errors/ServerError";
import { useStore } from "../stores/store";
import { LoadingComponent } from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";

const App: React.FC<RouteComponentProps> = ({ location }) => {
    const { userStore, commonStore } = useStore();

    useEffect(() => {
        if (commonStore.token) {
            userStore.getUser().finally(() => commonStore.setAppLoaded());
        } else {
            commonStore.setAppLoaded();
        }
    }, [commonStore, userStore]);

    if (!commonStore.appLoaded)
        return <LoadingComponent text="Loading App..." />;

    return (
        <Fragment>
            <ToastContainer position="bottom-right" hideProgressBar />
            <ModalContainer />
            <Route exact path="/" component={HomePage} />
            <Route
                path={"/(.+)"}
                render={() => (
                    <Fragment>
                        <NavBar />
                        <Container style={{ marginTop: "7em" }}>
                            <Switch>
                                <Route
                                    exact
                                    path="/activities"
                                    component={ActivityDashboard}
                                />
                                <Route
                                    exact
                                    path="/activities/:id"
                                    component={ActivityDetails}
                                />
                                <Route
                                    key={location.key} //help switch between create and edit state
                                    path={["/createActivity", "/manage/:id"]}
                                    component={ActivityForm2}
                                />
                                <Route path="/login" component={LoginForm} />
                                <Route
                                    exact
                                    path="/errors"
                                    component={TestErrors}
                                />
                                <Route
                                    path="/server-error"
                                    component={ServerError}
                                />
                                <Route component={NotFound} />
                            </Switch>
                        </Container>
                    </Fragment>
                )}
            />
        </Fragment>
    );
};

export default withRouter(observer(App)); //use withRouter to add key route feature within location
