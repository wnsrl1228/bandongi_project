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
    CardActionArea,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PetsIcon from '@mui/icons-material/Pets';
import axios from "axios";
import { Link as RouterLink} from "react-router-dom";
import cat1 from "./sample/cat1.jpg"
import dog1 from "./sample/dog1.jpg"
import dog2 from "./sample/dog2.jpg"
import dog3 from "./sample/dog3.jpg"
import dog4 from "./sample/dog4.jpg"
import dog5 from "./sample/dog5.jpg"
import dog6 from "./sample/dog6.jpg"
import dog7 from "./sample/dog7.jpg"
import dog8 from "./sample/dog8.jpg"


const hello=[dog1,dog6,dog3,dog4,dog5,cat1,dog2,dog7,dog8]
export default function MainComponent() {
    const [posts, setPosts] = useState([])
    useEffect(() => {
        const fecthPost = async () => {
            try{
                const res = await axios.get("/main");
                setPosts(res.data);
            } catch (err){
                alert(err);
            }
            
        }
        fecthPost();
    },[]);


    return (
        <Container  maxWidth="lg" sx={{mt: {xs:10,sm:16,md:20},mb:100}} >
            <Grid container spacing={2} justifyContent="space-evenly">
                {posts.map((post,index) => (
                    <Grid item xs={12} sm={6} md={4} key={post.id}
                        >
                        <Card sx={{}}>
                            <CardHeader
                                avatar={
                                    <Link component={RouterLink} to={{pathname:`/profile/${post.userId}`}}>
                                        <Avatar src={post.profile_img}></Avatar>
                            
                                    </Link>
                                    
                                }
                                action={
                                    <IconButton aria-label="settings">
                                        <MoreVertIcon />
                                    </IconButton>
                                }
                                sx={{p:1,pl:2,pr:2}}
                                title={
                                    <Link component={RouterLink} to={{pathname:`/profile/${post.userId}`}} underline="none" style={{color:"black"}}>
                                        {post.nickname}
                                    </Link>
                                }
                                subheader={post.created_date}
                            /><Divider light />
                            <CardActionArea component={RouterLink} to={{pathname:`/post/${post.id}`}}>
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
                                    image={hello[index]}
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
                            </CardActionArea>


                        </Card>
                        
                    </Grid>
                ))}
            </Grid>
        </Container>


    )
}
