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
    Skeleton,
    Stack,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import axios from "axios";
import { Link as RouterLink} from "react-router-dom";


export default function SearchComponent(props) {
    const category = props.category;
    const [posts, setPosts] = useState([])
    const [lastId, setLastId] = useState(0);
    const [finish, setFinish] = useState(0);
    useEffect(() => {
        const fecthPost = async () => {
            try{
                const res = await axios.get("api/search/"+window.location.search.split("=")[1]+"/paging/0");
                setPosts(res.data);
                if (res.data.length < 20) {
                    setFinish(1);
                }
            } catch (err){
                alert(err);
            }
            
        }
        fecthPost();
    },[]);

    const throttle = (callback, delay) => {
        let timer;

        return (event) => {
          // 타이머가 호출되면, 함수를 실행하고 타이머 제거
          if (timer) return;
          timer = setTimeout(() => {
            callback(event);
            timer = null;
          }, delay);
        };
      };
    // 페이징 스크롤 바닥에 닿으면 발생하는 이벤트
    window.onscroll = throttle((e) => {
            if ((window.innerHeight + window.scrollY) >= ((document.body.offsetHeight/5)*4)) {
                setLastId(posts[posts.length - 1].id)
                if (finish == 1) {
                    return false;
                }
                const url = "api/search/"+window.location.search.split("=")[1]+"/paging/"+posts[posts.length - 1].id;
                axios.get(url)
                    .then( (res) => {
                        setPosts(posts.concat(res.data))
                        if (lastId == posts[posts.length - 1].id) {
                            setFinish(1);
                        }
                        // setPosts();
                    }).catch( (err) => {
                        alert("다시 시도해주세요.");
                        return false;
                    })
            }
        
    },1000);
    return (
        <Container  maxWidth="lg" sx={{mt: {xs:10,sm:16,md:20},mb:60}} >
            <Container fixed sx={{p:2,mb:3}}>
                <Grid container justifyContent="space-between">
                <Typography variant="h5" sx={{fontWeight:"bold"}} >
                    {category == "friend-make" && "반려동물 친구 만들기"}
                    {category == "show-off" && "내 자식 자랑하기"}
                    {category == "qna" && "묻고 답하기"}
                    {category == "tips" && "꿀팁 전수"}
                </Typography>
                    <Link  component={RouterLink} to="/post/create" underline="none" style={{color:"white"}}>
                        <Button type="submit" variant="contained" sx={{mr:5}} size="large">
                            게시물 작성
                        </Button>
                    </Link>
                </Grid>
            </Container>


            <Grid container spacing={2} justifyContent="space-evenly">
                {posts.map((post,index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}
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
                {finish === 0 &&
                    <Grid container sx={{mt:5}} spacing={2} justifyContent="space-evenly">
                    <Stack spacing={1}>
                        {/* For variant="text", adjust the height via font-size */}
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        {/* For other variants, adjust the size with `width` and `height` */}
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="rectangular" width={210} height={60} />
                        <Skeleton variant="rounded" width={210} height={60} />
                    </Stack>
                    <Stack spacing={1}>
                        {/* For variant="text", adjust the height via font-size */}
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        {/* For other variants, adjust the size with `width` and `height` */}
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="rectangular" width={210} height={60} />
                        <Skeleton variant="rounded" width={210} height={60} />
                    </Stack>
                    <Stack spacing={1}>
                        {/* For variant="text", adjust the height via font-size */}
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        {/* For other variants, adjust the size with `width` and `height` */}
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="rectangular" width={210} height={60} />
                        <Skeleton variant="rounded" width={210} height={60} />
                    </Stack>
                    </Grid>
                }
            </Grid>
        </Container>


    )
}
