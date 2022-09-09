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
    Box,
    Button
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PetsIcon from '@mui/icons-material/Pets';
import axios from "axios";
import { Link as RouterLink} from "react-router-dom";




export default function ProfileComponent(props) {
    //session 토큰이랑 비교해서 화면 살짝 다르게 해야됨
    // 본인 프로필일 경우 vs 다른 사람 프로필일 경우
    // 친구 프로필일 경우 vs 친구가 아닌 사람일 경우

    const profile_id = props.profile_id; // 해당 유저 아이디, 
    const [posts, setPosts] = useState([])

    const [nickname, setNickname] = useState("")
    const [userId, setUserId] = useState("")
    const [profileImg, setProfileImg] = useState("")
    const [profileBackgroundImg, setProfileBackgroundImg] = useState("")
    const [title, setTitle] = useState("")
    const [profileContent, setProfileContent] = useState("")
    const [address, setAddress] = useState("")

    useEffect(() => {
        const fecthPost = async () => {
            try{
                const url = "/user/profile/" + profile_id;
                const res = await axios.get(url);
                setPosts(res.data);
                setNickname(res.data[0].nickname);
                setUserId(res.data[0].userId);
                setProfileImg(res.data[0].profile_img);
                setTitle(res.data[0].title);
                setProfileContent(res.data[0].profile_content);
                setAddress(res.data[0].address);
                setProfileBackgroundImg(res.data[0].profile_background_img);
               
            } catch (err){
                alert(err);
            }
            
        }
        fecthPost();
    },[]);

    // 자신의 프로필일 경우에만 프로필수정 버튼이 보임
    const isMyProfile = () => {
        if (userId == sessionStorage.getItem('token')){
            return <Grid item>
                        <Typography  >
                            <Button variant="outlined" component={RouterLink} to="/profile/edit">
                                <ManageAccountsIcon/>&nbsp; 프로필 수정
                            </Button>
                        </Typography>
                   </Grid>;
        }
        return ;
    }

    return (
        <Container  maxWidth="lg" sx={{mt: {xs:10,sm:16,md:20},mb:100}} >
            <Container fixed>
            <Grid container sx={{mb:3,p:2,pt:5}} alignItems="center">
                <Grid item style={{backgroundColor:"grey",borderRadius:"10px"}} xs={12} height="200px" sx={{boxShadow:4}}>
                    <Avatar   src={profileBackgroundImg|| ''} sx={{ bgcolor: "grey",height:"200px", width:"100%",borderRadius:"10px"}}  variant="square"/>
                </Grid>
                <Grid item sx={{ml:4,mt:-5}} >
                    <Link component={RouterLink} to={{pathname:`/profile/${userId}`}}>
                        <Avatar src={profileImg} sx={{boxShadow:3}}style={{width:"100px",height:"100px",border: '5px solid white'}}></Avatar>
                    </Link>
                </Grid>
                <Grid item  sx={{ml:2,mt: {xs:2}}} xs={10}  sm={7} md={8} lg={9}>
                    <Grid container justifyContent="space-between">
                        <Grid item>
                            <Typography  variant="h4" fontWeight="Bold" >
                                {nickname}
                            </Typography>
                        </Grid>
                        {isMyProfile()}
                    </Grid>

                </Grid>
                <Grid item  sx={{ml:3,mt:4}} xs={12}>
                  <Typography  variant="h5" fontWeight="Bold" >
                    사는 곳 : {address}
                  </Typography>
                </Grid>
                
                <Grid item  sx={{ml:3,mt:4,mb:-3}} xs={12}>
                  <Typography  variant="h5" fontWeight="Bold" >
                    자기소개
                  </Typography>
                </Grid>
                <Grid item  xs={12} sx={{mt:4}}>
                  <Container fixed style={{border: '1px solid #d2d2d2',borderRadius:"10px",backgroundColor:"#FFFFFF"}} sx={{p:5,boxShadow:4}}>
                    <Typography  variant="h6"  >
                      {profileContent}
                    </Typography>
                  </Container>
                </Grid>
            </Grid>
            <h1 style={{marginLeft:"20px"}}>글 목록</h1>
            </Container>
            
            
            <Container fixed>
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
        </Container>


    )
}
