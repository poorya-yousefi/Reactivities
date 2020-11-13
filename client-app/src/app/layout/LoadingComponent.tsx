import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

interface IProps {
    inverted?: boolean;
    text?: string;
}

export const LoadingComponent: React.FC<IProps> = ({
    inverted = true,
    text,
}) => {
    return (
        <Dimmer active inverted={inverted}>
            <Loader content={text} />
        </Dimmer>
    );
};
