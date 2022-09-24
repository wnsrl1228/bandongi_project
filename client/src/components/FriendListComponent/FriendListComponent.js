import React, { useState,useEffect} from 'react';

import { 
    Grid,
    Typography,
    Link,
    TextField,
    Button,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    Container
} from '@mui/material';
import axios from "axios";
import { Link as RouterLink} from "react-router-dom";
import { Box } from '@mui/system';

export default function FriendListComponent() {

    useEffect(() => {
      const fecthPost = async () => {

      }
        fecthPost();
    },[]);








    return (
      <Container  maxWidth="lg" sx={{mt: {xs:10,sm:16,md:20},mb:100}} >
        <Container fixed sx={{p:2,mb:5}}>
                <Grid container justifyContent="space-between">
                <Typography variant="h5" sx={{fontWeight:"bold"}} >
                    친구목록
                </Typography>
                    <Link  component={RouterLink} to="/post/create" underline="none" style={{color:"white"}}>
                        <Button type="submit" variant="contained" sx={{mr:5}} size="large">
                            게시물 작성
                        </Button>
                    </Link>
                </Grid>
            </Container>
    </Container>
    )
}
