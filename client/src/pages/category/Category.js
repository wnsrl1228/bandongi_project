
import React from 'react';
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent"
import LoggedInNavbarComponent from "../../components/NavbarComponent/LoggedInNavbarComponent"
import SidebarComponent from "../../components/SidebarComponent/SidebarComponent"
import CategoryComponent from "../../components/CategoryComponent/CategoryComponent"
import isLogin from "../../utils/isLogin"

import { 
    Grid,
} from '@mui/material';
export default function Category(props) {
    
    const LoggedInCheckView = (isLogin) => {
        if (isLogin) {
            return <LoggedInNavbarComponent/>
        } else {
            return <NavbarComponent/>
        }
    }
    return (
        <React.Fragment>
            {LoggedInCheckView(isLogin())}
            <Grid container width="100%" >
                <Grid item width="230px">
                    <SidebarComponent/>
                </Grid>
                <Grid item backgroundColor="#f0f2f5"  md>
                    <CategoryComponent category={props.category}/>
                </Grid>
            </Grid>

            
        </React.Fragment>
        
    )
}
