import React from 'react';
import LoggedInNavbarComponent from "../../components/NavbarComponent/LoggedInNavbarComponent"
import SidebarComponent from "../../components/SidebarComponent/SidebarComponent"
import ProfileUpdateComponent from "../../components/ProfileUpdateComponent/ProfileUpdateComponent"
import { 
    Grid,
} from '@mui/material';
import { useParams } from 'react-router-dom';
export default function ProfileUpdate() {

    //POST 아이디
    const { id } = useParams();

    return (
        <React.Fragment >
            <LoggedInNavbarComponent/>
            <Grid container width="100%" >
                <Grid item width="230px">
                    <SidebarComponent/>
                </Grid>
                <Grid item backgroundColor="#f0f2f5"  md >
                    <ProfileComponent/>
                </Grid>
            </Grid>

            
        </React.Fragment>
        
    )
}