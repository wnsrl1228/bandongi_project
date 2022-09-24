import React from 'react';
import LoggedInNavbarComponent from "../../components/NavbarComponent/LoggedInNavbarComponent"
import SidebarComponent from "../../components/SidebarComponent/SidebarComponent"
import FriendListComponent from "../../components/FriendListComponent/FriendListComponent"
import { 
    Grid,
} from '@mui/material';

export default function FriendList() {

    return (
        <React.Fragment >
            <LoggedInNavbarComponent/>
            <Grid container width="100%" >
                <Grid item width="230px">
                    <SidebarComponent/>
                </Grid>
                <Grid item backgroundColor="#f0f2f5"  md >
                    <FriendListComponent/>
                </Grid>
            </Grid>
        </React.Fragment>
        
    )
}