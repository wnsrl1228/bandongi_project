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
    Paper,
    Menu,
    MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import PetsIcon from '@mui/icons-material/Pets';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { Link as RouterLink} from "react-router-dom";
import axios from "axios";
import { Box } from '@mui/system';
import dog1 from '../MainComponent/sample/dog1.jpg';
const hello=[dog1];
export default function PostComponent(props) {

    const post_id = props.post_id;
    const [post, setPost] = useState([]);
    const [comments, setComments] = useState([]);
    const [likeValid, setLikeValid] = useState(''); // 댓글 추천수 유효성 체크

    const [userId, setUserId] = useState(''); 

    //댓글 관련 변수
    const [commentContent, setCommentContent] = useState('');

    // 수정 삭제 관련
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleModify = () => {
        const url = "/post/edit/" + post_id;
        window.location.assign(url);
    }
    const handleDelete = () => {
        var result = window.confirm("정말로 삭제하시겠습니까?");
        if(result){
            const url = "/post/" + post_id;
            axios.delete(url)
            .then((res) => {
                if (res.data.success == '성공'){
                    alert("게시글이 삭제되었습니다.");
                    window.location.replace("/");
                } else {
                    alert("다시 시도해주세요.");
                }
            })
            .catch((err) => {
                alert("다시 시도해주세요.");
            })
        }
        return false;
    }
    
    useEffect(() => {
        const fecthPost = async () => {
            setUserId(sessionStorage.getItem('token'));
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
                        userId == post.userId
                        ? 
                        <div>
                            <IconButton aria-label="settings"
                                id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                >
                                <MoreVertIcon />
                            </IconButton>

                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                'aria-labelledby': 'basic-button',
                                }}
                                
                                >
                                <MenuItem onClick={handleModify} sx={{p:0,px:3}}>
                                    <DriveFileRenameOutlineIcon style={{paddingBottom:"6px",paddingRight:'5px'}}/>
                                    수정
                                </MenuItem>
                                <MenuItem onClick={handleDelete} sx={{p:0, px:3}}>
                                    <DeleteIcon style={{paddingBottom:"6px",paddingRight:'5px'}}/>
                                    삭제
                                </MenuItem>
                            </Menu>
                        </div>
                        : <span></span>
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

                    {/* 게시글 추천수랑 댓글 */}
                    <CardActions disableSpacing >
                        <Grid container direction="row"justifyContent="flex-start" alignItems="center" >
                            <Typography  sx={{fontWeight:350,fontSize:14}}>
                            {
                                likeValid == 0
                                ? <IconButton onClick={plueMinusLike} sx={{mb:0.5}} disableRipple>   
                                        <PetsIcon fontSize="small"  padding="1"/>
                                  </IconButton>  
                                : <IconButton sx={{mb:0.5}} onClick={plueMinusLike} disableRipple style={{color:"#ff7961"}}>   
                                        <PetsIcon fontSize="small"  padding="1"/>
                                  </IconButton> 
                            }
                            {post.p_like_count}
                                
                            </Typography> 

                            <Typography  sx={{fontWeight:"100",fontSize:14, pl:2}}>
                                댓글 {post.comment_count}
                            </Typography>                                          
                        </Grid>
                    </CardActions>
                    <Divider light />
                    {/* 댓글달기 */}
                    {/* onSubmit={} */}
                    <Box component="form"  onSubmit={commentSubmit} sx={{ mt: 3 }}>
                    <Grid container justifyContent="flex-start"  sx={{px:2}}>
                        <Grid item xs={6} md={8} pr={2}>
                            <TextField
                                margin="normal"
                                name="content"
                                placeholder='댓글을 입력하세요...'
                                required 
                                fullWidth
                                autoComplete='off'
                                onChange ={onCommentContentHandler}
                                sx={{ mb:-1 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{pb:"6px"}}>
                                            <Avatar alt="profile"  sx={{ width: 28, height: 28 }}/>
                                        </InputAdornment>
                                        ),
                                    }}
                                // onChange={e => setUserId(e.target.value)}
                                variant="standard"
                            />
                        </Grid>
                        <Grid item xs={6} md={4}>
                            <Button type="submit" fullWidth variant="contained"
                            sx={{ mt : 3,mb:2 }}>
                                댓글 달기
                            </Button>
                        </Grid>
                    </Grid>
                    </Box>
                    {/* 댓글 목록*/}

                    {
                        post.c_id !== null 
                        ? comments.slice(0).reverse().map((comment,index) => (

                            <Paper style={{ padding: "10px 20px", marginTop:10 }} key={comment.c_id}>
                                <Grid container >
                                    <Grid item sx={{mr:2}}>
                                        <Link component={RouterLink} to={{pathname:`/profile/${comment.commentUserID}`}}>
                                            <Avatar src={comment.profile_img}></Avatar>
                                        </Link>
                                        
                                    </Grid>
                                    <Grid item  wrap="nowrap" xs>
                                        <h4 style={{ margin: 0, textAlign: "left" }}>
                                            <Link component={RouterLink} to={{pathname:`/profile/${comment.commentUserID}`}} underline="none" style={{color:"black"}}>
                                                {comment.commentNickname}
                                            </Link>
                                        </h4>
                                        {/* 댓글 내용 */}
    
                                        <Typography  style={{background:"#dcdcdc",display:"inline-block",whiteSpace: 'normal' }} 
                                                    sx={{p:1,mt:1,borderRadius:1,maxWidth:{xs:"300px",md:"500px"},wordWrap:'break-word',boxShadow:"1"}} height="auto" >
                                            {comment.c_content}
                                        </Typography>
    
    
                                        
                                        <Grid container direction="row"justifyContent="flex-start" alignItems="center" >
                                            <Typography  sx={{fontWeight:350,fontSize:12,maxWidth:"300px"}}>
                                                <IconButton sx={{mb:0.5}} disableRipple>   
                                                        <PetsIcon fontSize="small"  padding="1"/>
                                                </IconButton>   
                                                {comment.c_like_count}
                                            </Typography> 
                                            <Typography  sx={{fontWeight:"100",fontSize:12, px:2}}>
                                                댓글 달기
                                            </Typography>       
                                            <p style={{ textAlign: "left", color: "gray", fontSize:"15px"}}>
                                                {comment.c_created_date}
                                            </p>                                   
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                            )) : <div></div>
                    }
                    {
                        
                    }
            </Card>
        </Container>
    )
}
