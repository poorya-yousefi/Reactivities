import { observer } from "mobx-react-lite";
import React from "react";
import { Tab } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import ProfilePhotos from "./ProfilePhotos";
// import ProfileAbout from './ProfileAbout';
// import ProfileActivities from './ProfileActivities';
// import ProfileFollowings from './ProfileFollowings';
// import ProfilePhotos from './ProfilePhotos';

interface Props {
    profile: Profile;
}

export default observer(function ProfileContent({ profile }: Props) {
    //const {profileStore} = useStore();

    const panes = [
        { menuItem: "About", render: () => <Tab.Pane content="About" /> },
        {
            menuItem: "Photos",
            render: () => <ProfilePhotos profile={profile} />,
        },
        {
            menuItem: "Events",
            render: () => <Tab.Pane content="Events" />,
        },
        {
            menuItem: "Followers",
            render: () => <Tab.Pane content="Followers" />,
        },
        {
            menuItem: "Following",
            render: () => <Tab.Pane content="Following" />,
        },
    ];

    return (
        <Tab
            menu={{ fluid: true, vertical: true }}
            menuPosition="right"
            panes={panes}
            // onTabChange={(e, data) =>
            //     profileStore.setActiveTab(data.activeIndex)
            // }
        />
    );
});
