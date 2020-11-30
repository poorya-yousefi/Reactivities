import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Button, Card, Image } from "semantic-ui-react";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import ActivityStore from "../../../app/stores/activityStore";

interface DetailsParam {
    id: string;
}

const ActivityDetails: React.FC<RouteComponentProps<DetailsParam>> = ({
    match,
    history,
}) => {
    const activityStore = useContext(ActivityStore);
    const { activity, loadActivity, loadingInitial } = activityStore;

    useEffect(() => {
        loadActivity(match.params.id);
    }, [loadActivity, match.params.id]);

    if (loadingInitial || !activity)
        return <LoadingComponent text={"Activity Loading..."} />;

    return (
        <Card fluid>
            <Image
                src={`/assets/categoryImages/${activity!.category}.jpg`}
                wrapped
                ui={false}
            />
            <Card.Content>
                <Card.Header>{activity!.title}</Card.Header>
                <Card.Meta>
                    <span className="date">{activity!.date}</span>
                </Card.Meta>
                <Card.Description>{activity!.description}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths="2">
                    <Button
                        basic
                        content="Edit"
                        color="blue"
                        as={Link}
                        to={"/manage/" + activity.id}
                    />
                    <Button
                        basic
                        content="Cancel"
                        color="grey"
                        onClick={() => history.push("/activities")}
                    />
                </Button.Group>
            </Card.Content>
        </Card>
    );
};

export default observer(ActivityDetails);
