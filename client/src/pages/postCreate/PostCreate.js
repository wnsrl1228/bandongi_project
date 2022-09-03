import React from 'react';
import LoggedInNavbarComponent from "../../components/NavbarComponent/LoggedInNavbarComponent"
import SidebarComponent from "../../components/SidebarComponent/SidebarComponent"
import PostCreateComponent from "../../components/PostCreateComponent/PostCreateComponent"
import { 
    Grid,
} from '@mui/material';
import { useParams } from 'react-router-dom';
export default function PostCreate() {

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
                    <PostCreateComponent/>
                </Grid>
            </Grid>

            
        </React.Fragment>
        
    )
}
