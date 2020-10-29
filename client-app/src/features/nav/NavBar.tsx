import React from "react";
import { Menu, Container, Button } from "semantic-ui-react";

export const NavBar = () => {
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
                    {/* <Button positive>Create Activity</Button> */}
                </Menu.Item>
            </Menu>
        </Container>
    );
};
