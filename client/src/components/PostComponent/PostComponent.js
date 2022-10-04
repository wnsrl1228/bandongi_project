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
    MenuItem,
    Modal
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import PetsIcon from '@mui/icons-material/Pets';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { Link as RouterLink} from "react-router-dom";
import axios from "axios";
import { Box } from '@mui/system';
export default function PostComponent(props) {
   
    const post_id = props.post_id;
    const [post, setPost] = useState([]);
    const [comments, setComments] = useState([]);
    const [likeValid, setLikeValid] = useState(''); // 댓글 추천수 유효성 체크

    const [userId, setUserId] = useState(''); 

    //페이징
    const [lastId, setLastId] = useState(0);
    const [finish, setFinish] = useState(0);

    //댓글 관련 변수
    const [commentContent, setCommentContent] = useState('');
    const [openComment, setOpenComment] = React.useState(false);
    const [currentCommentContent, setCurrentCommentContent] = useState('');
    const [currentCommentId, setCurrentCommentId] = useState('');
    const handleCommentOpen = (comment) => {
        setOpenComment(true);
        setCurrentCommentContent(comment.c_content);
        setCurrentCommentId(comment.c_id);
    }
    const handleCommentClose = () => {
        setOpenComment(false);
        setCurrentCommentContent('');
        setCurrentCommentId('');
    }
    // 수정 삭제 관련
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        var result = window.confirm("정말로 삭제하시겠습니까?");
        if(result){
            const url = "/api/post/" + post_id;
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
                const url = "/api/post/" + post_id;
                const res = await axios.get(url);
                setPost(res.data[0]);
            } catch (err){
                alert(err);
            }
            try{
                const url = "/api/post/"+post_id+"/comment/paging/" + lastId;
                const res = await axios.get(url);
                setComments(res.data)
                
                if (res.data.length < 20) {
                    setFinish(1);
                }
            } catch (err){
                alert(err);
            }

            // 추천 유효성 api 요청
            try{
                const url = "/api/post/like/valid/" + post_id;
                const res = await axios.get(url);
                setLikeValid(res.data[0].valid);
            } catch (err){
                alert(err);
            }
        }
        fecthPost();
    },[]);


    const plusComments = () => {

        setLastId(comments[comments.length - 1].c_id);
        if (finish == 1) {
            return false;
        }
        const url = "/api/post/"+post_id+"/comment/paging/" + comments[comments.length - 1].c_id;
        axios.get(url)
            .then( (res) => {
                setComments(comments.concat(res.data))
                if (res.data.length < 20) {
                    setFinish(1)
                }

            }).catch( (err) => {
                alert("다시 시도해주세요.");
                return false;
            })
    }


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

        axios.post("/api/post/comment",body)
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
            axios.post("/api/post/like/plus",body)
            .then((res) => {
                setLikeValid(likeValid+1);
                post.p_like_count++;
            })
            .catch((err) => {
                alert("다시 시도해주세요.");
            })

        } else {
            axios.post("/api/post/like/minus",body)
                .then((res) => {
                    setLikeValid(likeValid-1);
                    post.p_like_count--;
                })
                .catch( (err) => {
                    alert("다시 시도해주세요.");
                })
        }

    }
    const plueCommentLike = (event, comment) => {
        if (comment.commentUserID == sessionStorage.getItem('token')) {
            alert("자신의 댓글은 추천할 수 없습니다.")
            return;
        }

        const body = {
            comment_id: comment.c_id,
        }
        const target = event.currentTarget.parentElement.parentElement.children[1]
        axios.post("/api/post/comment/like",body)
        .then((res) => {
            if (res.data.result === "refuse") {
                alert("이미 추천한 댓글 입니다.");
                
            } else {
                target.innerHTML++;
            }
        })
        .catch((err) => {
            alert("다시 시도해주세요.");
        })        
    }

    // 댓글 삭제
    const handleCommentDelete = (comment) => {
        var result = window.confirm("정말로 삭제하시겠습니까?");
        if(result){
            const url = "/api/post/comment/" + comment.c_id;
            axios.delete(url)
            .then((res) => {
                if (res.data.success == '성공'){
                    window.location.reload()
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
    
    // 댓글 수정
    const handleCommentModify = () => {

        if (currentCommentId === '') {
            return false;
          }else if (currentCommentContent.trim().length == 0 ) {
            alert("내용을 입력해주세요.");
            return false;
          } else {
            const body = {
              content : currentCommentContent
            };
           
            axios.patch("/api/post/comment/"+currentCommentId,body)
                .then( (res) => {
                    if (res.data.success){
                        window.location.reload()
                    } else{
                        alert("다시 시도해주세요.");
                        return false;
                    }
                }).catch( (err) => {
                    alert("다시 시도해주세요.");
                    return false;
                })
          }
    }
    
    const onContentHandler = (e) => {
        setCurrentCommentContent(e.currentTarget.value)
    }

    const modalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4
      };
    return (
        <Container  maxWidth="sm" sx={{mt: 20,mb:60}}>
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
                                <MenuItem sx={{p:0,px:3}} component={Link} onClick={() => {window.location.href=`/post/edit/${post_id}`}}>
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
                    {post.post_img === '' 
                    ? <span></span>
                    :                    
                        <CardMedia
                            component="img"
                            sx={{
                                height:"194",
                            // 16:9
                            // pt: '56.25%',
                            }}
                            image={post.post_img}
                            
                            alt="random"/>
                    }

                
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
                        ? comments.map((comment,index) => (

                            <Paper style={{ padding: "10px 20px", marginTop:10 }} key={index}>
                                <Grid container >
                                    <Grid item sx={{mr:2}}>
                                        <Link component={RouterLink} to={{pathname:`/profile/${comment.commentUserID}`}}>
                                            <Avatar src={comment.commentUserProfileImg}></Avatar>
                                        </Link>
                                        
                                    </Grid>
                                    <Grid item xs>
                                        <Grid container direction="row" justifyContent="space-between" alignItems="center" >
                                            <h4 style={{ margin: 0, textAlign: "left" }}>
                                                <Link component={RouterLink} to={{pathname:`/profile/${comment.commentUserID}`}} underline="none" style={{color:"black"}}>
                                                    {comment.commentNickname}
                                                </Link>
                                            </h4>
                                            {
                                                userId == comment.commentUserID
                                                ? 

                                                <Typography component={'p'}>
                                                    <Modal
                                                        open={openComment}
                                                        onClose={handleCommentClose}
                                                        aria-labelledby="modal-modal-title"
                                                        aria-describedby="modal-modal-description"
                                                    >
                                                        <Box sx={modalStyle}>
                                                        <Typography id="modal-modal-title" variant="h6" component="h2">
                                                            수정할 내용
                                                        </Typography>
                                                        <Grid item  sx={{ml:3,mt:4,mb:-3}} xs={12}>
                                                            <Typography  variant="h5" fontWeight="Bold" style={{display:"inline-block", margin:"5px"}}>
                                                            내용
                                                            </Typography>
                                                            <Typography  variant="h6"  >
                                                            <TextField
                                                                    margin="normal"
                                                                    onChange = {onContentHandler}
                                                                    placeholder='내용을 입력해주세요.'
                                                                    autoComplete='off'
                                                                    fullWidth
                                                                    size="small"
                                                                    required 
                                                                    multiline
                                                                    defaultValue={currentCommentContent || ''}
                                                                    rows={10}
                                                                    sx={{mt:0}}
                                                                />
                                                            </Typography>
                                                        </Grid>

                                                        <Grid container  item  xs={12} sx={{mt:4}} justifyContent="flex-end">
                                                            <Button  variant="contained" onClick={handleCommentModify} sx={{ mt : 3,mb:2,mr:2}}>
                                                                    게시물 등록
                                                            </Button>
                                                            <Button variant="contained" onClick={handleCommentClose}  sx={{ mt : 3,mb:2,mr:2}}>
                                                                    취소
                                                            </Button>
                                                        </Grid>
                                                        </Box>
                                                    </Modal>
                                                    <IconButton onClick={()=>{handleCommentOpen(comment)}}>
                                                        <DriveFileRenameOutlineIcon />
                                                   </IconButton>
                                                    <IconButton onClick={()=>{handleCommentDelete(comment)}}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Typography>
                                                : <span></span>
                                            }
                                        </Grid>

                                        {/* 댓글 내용 */}
    
                                        <Typography  style={{background:"#dcdcdc",display:"inline-block",whiteSpace: 'normal' }} 
                                                    sx={{p:1,mt:1,borderRadius:1,maxWidth:{xs:"300px",md:"500px"},wordWrap:'break-word',boxShadow:"1"}} height="auto" >
                                            {comment.c_content}
                                        </Typography>
    
    
                                        
                                        <Grid container direction="row"justifyContent="flex-start" alignItems="center" >
                                            <Typography  sx={{fontWeight:350,fontSize:12,maxWidth:"300px"}}>
                                                <IconButton  onClick={(event) => {plueCommentLike(event,comment);}} style={{}} sx={{mb:0.5}} disableRipple>   
                                                        <PetsIcon fontSize="small"  padding="1"/>
                                                </IconButton>   
                                            </Typography> 
                                            <Typography  sx={{fontWeight:350,fontSize:12,maxWidth:"300px"}}>
                                                {comment.c_like_count}
                                            </Typography>
                                            {/* <Typography  sx={{fontWeight:"100",fontSize:12, px:2}}>
                                                댓글 달기
                                            </Typography>        */}
                                            <Typography component={'p'} sx={{px:2}} style={{ textAlign: "left", color: "gray", fontSize:"15px"}}>
                                                {comment.c_created_date}
                                            </Typography>                                   
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                            )) : <div></div>
                    }
            </Card>
            {finish === 0 &&
                <Button type="submit" variant="contained" sx={{mb:5 ,mr:5}} onClick={plusComments} size="large">
                    댓글 더 보기
                </Button>
                }
        </Container>
    )
}
