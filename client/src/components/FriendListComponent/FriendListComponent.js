import React, { useState,useEffect} from 'react';

import { 
    Grid,
    Typography,
    Link,
    CardActions,
    CardContent,
    CardHeader,
    CardActionArea,
    Container,
    Card,
    Avatar,
    ToggleButtonGroup,
    ToggleButton, 
    Button
} from '@mui/material';
import axios from "axios";
import { Link as RouterLink} from "react-router-dom";
import { Box } from '@mui/system';

export default function FriendListComponent() {
    const [alignment, setAlignment] = React.useState('allFriend');

    const [friends, setFriends] = useState([])
    const handleChange = (event, newAlignment) => {
        if (newAlignment !== null) {
            setAlignment(newAlignment);
          }
    };


    useEffect(() => {
        const fecthPost = async () => {
            try{
                const res = await axios.get("/api/friend");
                setFriends(res.data);
                console.log(res.data)
            } catch (err){
                alert(err);
            }
            
        }
        fecthPost();
    },[]);
 

    const allFriend = (e) => {
        axios.get("/api/friend")
            .then( (res) => {
                setFriends(res.data);
            })
            .catch( (err) => {
                alert("다시 시도해주세요");
            })
    };

    const receiveFriend = (e) => {
        axios.get("/api/friend/receive")
            .then( (res) => {
                setFriends(res.data);
            })
            .catch( (err) => {
                alert("다시 시도해주세요");
            })
    };

    const sendFriend = (e) => {
        axios.get("/api/friend/send")
            .then( (res) => {
                setFriends(res.data);
            })
            .catch( (err) => {
                alert("다시 시도해주세요");
            })
    };

    const blockFriend = (e) => {
        axios.get("/api/friend/block")
            .then( (res) => {
                setFriends(res.data);
            })
            .catch( (err) => {
                alert("다시 시도해주세요");
            })
        
    };
    
    // 여기서 부터는 버튼 이벤트들 
    const deleteFriend = (friend_id, index) => {
        alert("정말로 친구를 그만두시겠습니까?");
        console.log(index)
        axios.delete("/api/friend/"+friend_id)
            .then( (res) => {
                alert("친구목록에서 삭제되었습니다.");
            })
            .catch( (err) => {
                alert("다시 시도해주세요")
            })
        window.location.reload()
    };
    const acceptFriend = async (friend_id) => {
        axios.get("/api/friend/accept/"+friend_id)
            .then( (res) => {
                alert("새로운 친구가 생겼습니다!");
            })
            .catch( (err) => {
                alert("다시 시도해주세요")
            })
            window.location.reload()
    };
    const refuseFriend = async (friend_id) => {
        axios.get("/api/friend/refuse/"+friend_id)
            .then( (res) => {
                alert("친구요청을 거부하였습니다.");
            })
            .catch( (err) => {
                alert("다시 시도해주세요")
            })
            window.location.reload()
    };
    const cancelFriend = async (friend_id) => {
        axios.delete("/api/friend/cancel/"+friend_id)
            .then( (res) => {
                alert("친구요청이 취소되었습니다.");
            })
            .catch( (err) => {
                alert("다시 시도해주세요")
            })
            window.location.reload()
    };
    const blockCancelFriend = async (friend_id) => {
        axios.get("/api/friend/block/cancel/"+friend_id)
            .then( (res) => {
                alert("친구차단을 취소하였습니다.");
            })
            .catch( (err) => {
                alert("다시 시도해주세요")
            })
            window.location.reload()
            
    };

    return (
      <Container  maxWidth="lg" sx={{mt: {xs:10,sm:16,md:20},mb:80}} >
        <Container fixed sx={{p:2,mb:5}}>
            <Typography variant="h5" sx={{fontWeight:"bold"}} >
                친구목록
            </Typography>
        </Container>

            <ToggleButtonGroup
                color="primary"
                value={alignment}
                exclusive
                onChange={handleChange}
                aria-label="Platform"
                >
                <ToggleButton value="allFriend"  onClick={allFriend}>모든 친구</ToggleButton>
                <ToggleButton value="receiveFriend" onClick={receiveFriend}>받은 요청</ToggleButton>
                <ToggleButton value="sendFriend" onClick={sendFriend}>보낸 요청</ToggleButton>
                <ToggleButton value="blockFriend" onClick={blockFriend}>차단 목록</ToggleButton>
            </ToggleButtonGroup>

            <Container style={{border: '1px solid #d2d2d2',borderRadius:"10px",backgroundColor:"#FFFFFF"}} sx={{p:5,boxShadow:4}}>
                <Grid container spacing={2} justifyContent="space-evenly">
                    {friends.map((friend,index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{}} >
                            <CardHeader
                                avatar={
                                        <Avatar src={friend.profile_img|| ''} style={{width:80,height:80,borderRadius:10}}>
                                        </Avatar> 
                                }
                                title= {
                                    <Link component={RouterLink} to={{pathname:`/profile`}} underline="none" style={{color:"black",fontSize:20}}>
                                        {friend.nickname}
                                    </Link>
                                }
                            />
                            
                                <CardActions disableSpacing >
                                    {
                                        alignment === "allFriend" &&
                                        <Grid container direction="row" justifyContent="flex-end" sx={{px:1}}>
                                            <Button variant="outlined" onClick={e=>{deleteFriend(friend.friend_id, index)}}>
                                                친구 취소
                                            </Button>
                                        </Grid>
                                    }
                                    {
                                        alignment === "receiveFriend" &&
                                        <Grid container direction="row" justifyContent="flex-end" sx={{px:1}}>
                                            <Button variant="outlined" onClick={e=>{acceptFriend(friend.id)}} >
                                                확인
                                            </Button>
                                            <Button sx={{ml:3}}variant="outlined" onClick={e=>{refuseFriend(friend.id)}} >
                                                삭제
                                            </Button>
                                        </Grid>
                                    }
                                    {
                                        alignment === "sendFriend" &&
                                        <Grid container direction="row" justifyContent="flex-end" sx={{px:1}}>
                                            <Button variant="outlined" onClick={e=>{cancelFriend(friend.id)}}>
                                                요청 취소
                                            </Button>
                                        </Grid>
                                    }
                                    {
                                        alignment === "blockFriend" &&
                                        <Grid container direction="row" justifyContent="flex-end" sx={{px:1}}>
                                            <Button variant="outlined"  onClick={e=>{blockCancelFriend(friend.id)}}>
                                                차단 취소
                                            </Button>
                                        </Grid>
                                    }

                                </CardActions>
                            
                        </Card>
                    </Grid>
                    ))}
                </Grid>
            </Container>
        
    </Container>
    )
}
