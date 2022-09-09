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
    Button,
    CardActionArea,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import axios from "axios";
import { Link as RouterLink} from "react-router-dom";


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
            <Grid container justifyContent="flex-end">
                <Link  component={RouterLink} to="/post/create" underline="none" style={{color:"white"}}>
                    <Button type="submit" variant="contained" sx={{mb:5 ,mr:5}} size="large">
                        게시물 작성
                    </Button>
                </Link>
            </Grid>
            <Grid container spacing={2} justifyContent="space-evenly">
                {posts.map((post,index) => (
                    <Grid item xs={12} sm={6} md={4} key={post.id}
                        >
                        <Card sx={{}}>
                            <CardHeader
                                avatar={
                                    <Link component={RouterLink} to={{pathname:`/profile/${post.userId}`}}>
                                        <Avatar src={post.profile_img || ''}></Avatar>
                            
                                    </Link>
                                    
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
                                    <Typography gutterBottom variant="body1" component="div" fontWeight="bold"
                                        sx={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "-webkit-box",
                                            WebkitLineClamp: "1",
                                            WebkitBoxOrient: "vertical",
                                            fontSize:"20px",
                                            mt:1
                                        }}>
                                        {post.title}
                                    </Typography>
                                </CardContent>
                                {post.post_img === '' 
                                    ? <span></span>
                                    :                    
                                        <CardMedia
                                            component="img"
                                            sx={{
                                                height:"190px",
                                            }}
                                            image={post.post_img}
                                            
                                            alt=""/>
                                }
                            
                                <CardContent>
                                {post.post_img === '' 
                                ? <Typography variant="body2" gutterBottom 
                                    sx={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitLineClamp: "7",
                                        WebkitBoxOrient: "vertical",
                                        fontSize:"18px",
                                        height:"180px"
                                    }}>
                                    {post.content}
                                </Typography>
                                : <Typography variant="body2" gutterBottom 
                                    sx={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitLineClamp: "2",
                                        WebkitBoxOrient: "vertical",
                                        fontSize:"18px",
                                    }}>
                                    {post.content}
                                </Typography>
                                }
                                    
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
