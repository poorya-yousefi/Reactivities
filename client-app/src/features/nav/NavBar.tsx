import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Menu, Container, Button } from "semantic-ui-react";
import ActivityStore from "../../app/stores/activityStore";

const NavBar: React.FC = () => {
    const activityStore = useContext(ActivityStore);
    const { openCreateForm } = activityStore;

    return (
        <Container>
            <Menu fixed="top" inverted>
                <Menu.Item header>
                    <img
                        src="/assets/logo.png"
                        alt="logo"
                        style={{ marginRight: 10 }}
                    />
                    Reactivities
                </Menu.Item>
                <Menu.Item name="Activities" />
                <Menu.Item>
                    <Button
                        positive
                        content={"Create Activity"}
                        onClick={() => openCreateForm()}
                    />
                </Menu.Item>
            </Menu>
        </Container>
    );
};

export default observer(NavBar);
