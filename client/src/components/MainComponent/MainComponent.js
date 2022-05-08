import React, { useState,useEffect} from 'react';
import { styled, alpha } from '@mui/material/styles';
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
    Divider
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PetsIcon from '@mui/icons-material/Pets';
import axios from "axios";
const h=[1,2,3,4,5,6]
export default function MainComponent() {
    const [posts, setPosts] = useState([])
    useEffect(() => {
        const fecthPost = async () => {
            const res = await axios.get("/main");
            setPosts(res.data);
        }
        fecthPost();
    },[]);
    console.log(posts)
    return (
        <Container  maxWidth="lg" sx={{mt: {xs:5,sm:16,md:20}}}>
            <Grid container spacing={2} justifyContent="space-evenly">
                {posts.map((post) => (
                    <Grid item xs={12} sm={6} md={4} key={post.id}
                        >
                        <Card sx={{}}>
                            <CardHeader
                                avatar={
                                    <Avatar src={post.profile_img}></Avatar>
                                }
                                action={
                                    <IconButton aria-label="settings">
                                        <MoreVertIcon />
                                    </IconButton>
                                }
                                sx={{p:1,pl:2,pr:2}}
                                title={post.nickname}
                                subheader={post.created_date}
                            /><Divider light />
                            <CardContent sx={{p:1,pl:2,pr:1}}>
                                <Typography gutterBottom variant="body1" component="div" fontWeight="bold">
                                    {post.title}
                                </Typography>
                            </CardContent>
                            
                            <CardMedia
                                component="img"
                                sx={{
                                    height:"194",
                                // 16:9
                                // pt: '56.25%',
                                }}
                                image={require('./dog.jpg')}
                                alt="random"
                            />
                            <CardContent>
                                <Typography variant="body2" gutterBottom>
                                    {post.content}
                                </Typography>
                            </CardContent>
                            <Divider light />

                            <CardActions disableSpacing >
                                <Grid container direction="row"justifyContent="space-between" alignItems="center" sx={{px:1}}>
                                
                                    <Typography  sx={{fontWeight:"100",fontSize:12}}>
                                        댓글 {post.comment_count}
                                    </Typography>
                                    <Typography  sx={{fontWeight:350,fontSize:14}}>
                                        <IconButton sx={{mb:0.5}} disableRipple>   
                                                <PetsIcon fontSize="small"  padding="1"/>
                                        </IconButton>   
                                        {post.like_count}
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
