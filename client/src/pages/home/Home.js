import React, { useState } from 'react';
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent"
import LoggedInNavbarComponent from "../../components/NavbarComponent/LoggedInNavbarComponent"
import SidebarComponent from "../../components/SidebarComponent/SidebarComponent"
import MainComponent from "../../components/MainComponent/MainComponent"
import { 
    Grid,
    Box,
} from '@mui/material';
export default function Home() {
    return (
        <React.Fragment>
            <NavbarComponent/>
            <Grid container width="100%" >
                <Grid width="230px">
                    <SidebarComponent/>
                </Grid>
                <Grid backgroundColor="#f0f2f5"  md>
                    <MainComponent/>
                </Grid>
            </Grid>

            
        </React.Fragment>
        
    )
}
