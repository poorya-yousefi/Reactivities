import React, { Fragment } from "react";
import "./styles.css";
import { Container } from "semantic-ui-react";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import { Route, RouteComponentProps, withRouter } from "react-router-dom";
import { HomePage } from "../../features/home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";

const App: React.FC<RouteComponentProps> = ({ location }) => {
    return (
        <Fragment>
            <Route exact path="/" component={HomePage} />
            <Route
                path={"/(.+)"}
                render={() => (
                    <Fragment>
                        <NavBar />
                        <Container style={{ marginTop: "7em" }}>
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
                                component={ActivityForm}
                            />
                        </Container>
                    </Fragment>
                )}
            />
        </Fragment>
    );
};

export default withRouter(observer(App)); //use withRouter to add key route feature within location
