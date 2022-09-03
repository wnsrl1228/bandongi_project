import React, { useState,useEffect} from 'react';

import { 
    Grid,
    Card,
    CardMedia,
    Container,
    Typography,
    CardActions,
    CardContent,
    CardHeader,
    Avatar,
    IconButton,
    Divider,
    Link,
    TextField,
    Button,
    InputAdornment,
    Paper
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PetsIcon from '@mui/icons-material/Pets';
import AccountCircle from '@mui/icons-material/AccountCircle';
import axios from "axios";
import { Link as RouterLink,useNavigate} from "react-router-dom";
import { Box } from '@mui/system';
import dog1 from '../MainComponent/sample/dog1.jpg';
const hello=[dog1];
export default function PostCreateComponent() {


    
    useEffect(() => {
        const fecthPost = async () => {

        }
        fecthPost();
    },[]);



    // 댓글 등록하기
    const commentSubmit = (e) => {
        
    };



    return (
        <Container  maxWidth="md" sx={{mt: 20,mb:100}}>
            
        </Container>
    )
}
