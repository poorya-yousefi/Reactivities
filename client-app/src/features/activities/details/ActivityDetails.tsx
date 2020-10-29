import React from "react";
import { Button, Card, Image } from "semantic-ui-react";

export const ActivityDetails = () => {
    return (
        <Card fluid>
            <Image src="/assets/placeholder.png" wrapped ui={false} />
            <Card.Content>
                <Card.Header>Title</Card.Header>
                <Card.Meta>
                    <span className="date">Date</span>
                </Card.Meta>
                <Card.Description>Description</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths="2">
                    <Button basic color="blue">
                        Edit
                    </Button>
                    <Button basic color="grey">
                        Cancel
                    </Button>
                </Button.Group>
            </Card.Content>
        </Card>
    );
};
