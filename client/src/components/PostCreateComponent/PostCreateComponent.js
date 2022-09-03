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
export default function PostComponent(props) {

    const navigate = useNavigate();

    const post_id = props.post_id;
    const [post, setPost] = useState([]);
    const [comments, setComments] = useState([]);
    const [likeValid, setLikeValid] = useState(''); // 댓글 추천수 유효성 체크

    //댓글 관련 변수
    const [commentContent, setCommentContent] = useState('');

    
    useEffect(() => {
        const fecthPost = async () => {

            // post페이지의 데이터 불러오기
            try{
                const url = "/post/" + post_id;
                const res = await axios.get(url);
                setComments(res.data)
                setPost(res.data[0]);
            } catch (err){
                alert(err);
            }

            // 추천 유효성 api 요청
            try{
                const url = "/post/like/valid/" + post_id;
                const res = await axios.get(url);
                setLikeValid(res.data[0].valid);
            } catch (err){
                alert(err);
            }


        }
        fecthPost();
    },[]);


    const onCommentContentHandler = (e) => {
        setCommentContent(e.currentTarget.value);
      } 
    
    // 댓글 등록하기
    const commentSubmit = (e) => {
        if (commentContent === '') {
            alert("내용을 입력해주세요");
            return;
        }
        const body = {
            post_id: post_id,
            content: commentContent
        }

        axios.post("/post/comment",body)
            .catch( (err) => {
                alert("다시 시도해주세요.");
            })
    };
    
    const plueMinusLike = (e) => {

        if (post.userId == sessionStorage.getItem('token')) {
            alert("자신의 글은 추천할 수 없습니다.")
            return;
        }

        const body = {
            post_id: post_id,
        }
        

        if (likeValid == 0) {
            axios.post("/post/like/plus",body)
            .then((res) => {
                setLikeValid(likeValid+1);
                post.p_like_count++;
            })
            .catch((err) => {
                alert("다시 시도해주세요.");
            })

        } else {
            axios.post("/post/like/minus",body)
                .then((res) => {
                    setLikeValid(likeValid-1);
                    post.p_like_count--;
                })
                .catch( (err) => {
                    alert("다시 시도해주세요.");
                })
        }

    }


    return (
        <Container  maxWidth="md" sx={{mt: 20,mb:100}}>
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
                            {post.userNickname}
                        </Link>}
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
                        image={hello[0]}
                        
                        alt="random"
                    />
                
                    <CardContent>
                        <Typography variant="body2" gutterBottom>
                            {post.content}
                        </Typography>
                    </CardContent>
                    <Divider light />
            </Card>
        </Container>
    )
}
