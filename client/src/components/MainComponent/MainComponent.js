import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { 
    Grid,
    Card,
    CardMedia,
    Container,
    Button,
    Typography,
    CardActions,
    CardContent,
    CardHeader,
    Avatar,
    IconButton,
    Divider
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PetsIcon from '@mui/icons-material/Pets';


const hi = ["saaaaaaaaaaaaaaaaaaaaaaaaaaaaaㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴ","ㅁㄴㅇ","ㄴㅇ","ㄴㅇ","ㅁㄴㅇ","ㄴㅁㅇㄴㅁㅁㄴㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴ"]
export default function MainComponent() {
    return (
        <Container  maxWidth="lg" sx={{mt: {xs:5,sm:16,md:20}}}>
            <Grid container spacing={2} justifyContent="space-evenly">
                {hi.map((text,index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}
                        >
                        
                            <Card sx={{}}>
                                <CardHeader
                                    avatar={
                                        <Avatar></Avatar>
                                    }
                                    action={
                                        <IconButton aria-label="settings">
                                            <MoreVertIcon />
                                        </IconButton>
                                    }
                                    sx={{p:1,pl:2,pr:2}}
                                    title="김준기"
                                    subheader="1분 전"
                                /><Divider light />
                                <CardContent sx={{p:1,pl:2,pr:1}}>
                                    <Typography gutterBottom variant="body1" component="div" fontWeight="bold">
                                        이 곳에는 제목이 들어 갑니다. 그런데 제목이 길면 어떻게 처리할까요
                                    </Typography>
                                </CardContent>
                                
                                <CardMedia
                                    component="img"
                                    sx={{
                                        height:"194",
                                    // 16:9
                                    // pt: '56.25%',
                                    }}
                                    // image="https://source.unsplash.com/random/200"
                                    image={require('./dog.jpg')}
                                    alt="random"
                                />
                                <CardContent>
                                    <Typography variant="body2" gutterBottom>
                                        이 곳에는 내용이 들어갑니다.{text}
                                    </Typography>
                                </CardContent>
                                <Divider light />

                                <CardActions disableSpacing >
                                    <Grid container direction="row"justifyContent="space-between" alignItems="center" sx={{px:1}}>
                                    
                                        <Typography  sx={{fontWeight:"100",fontSize:12}}>
                                            댓글 12
                                        </Typography>
                                        <Typography  sx={{fontWeight:350,fontSize:14}}>
                                            <IconButton sx={{mb:0.5}}>   
                                                    <PetsIcon fontSize="small" Width="10" padding="1"/>
                                            </IconButton>   
                                            8
                                        </Typography>                                                          
                                    </Grid>
                                    
                                </CardActions>
                            </Card>
                        
                    </Grid>
                ))}
            </Grid>
        </Container>


    )
}
