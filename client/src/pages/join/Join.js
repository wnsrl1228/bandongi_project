import React, { useState } from 'react';
import axios from "axios";
import { Button,
    TextField,
    Checkbox,
    FormControlLabel,
    Link,
    Grid,
    Typography,
    Box,
    Container,
    Paper,
    Stack
} from '@mui/material';

import { Link as RouterLink ,useNavigate} from "react-router-dom";
export default function Join() {

    const [userId, setUserId] = useState("")
    const [password, setPassword] = useState("")
    const [passwordCheck, setPasswordCheck] = useState("")
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [nickname, setNickname] = useState("")

    const navigate = useNavigate();
    const onUserIdHandler = (e) => {
        setUserId(e.currentTarget.value);
    }
    const onPasswordHandler = (e) => {
        setPassword(e.currentTarget.value);
    }
    const onPasswordCheckHandler = (e) => {
        setPasswordCheck(e.currentTarget.value);
    }
    const onEmailHandler = (e) => {
        setEmail(e.currentTarget.value);
    }
    const onUsernameHandler = (e) => {
        setUsername(e.currentTarget.value);
    }
    const onNicknameHandler = (e) => {
        setNickname(e.currentTarget.value);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if(password !== passwordCheck) {
            return alert('비밀번호와 비밀번호확인은 같아야 합니다.')
        }
        if (userId.length < 5) {
            return alert('아이디는 최소 5글자여야 합니다.')
        } 
        
        const body = {
            userId: userId,
            password: password,
            email: email,
            username: username,
            nickname: nickname,
            token : sessionStorage.getItem('token')
        }
        axios.post("/auth/join",body)
            .then( (res) => {
                console.log(res)
                if (res.data.success){
                    alert("회원가입에 성공하셨습니다.");
                    navigate('/login');
                } else{
                    alert(res.data.message);
                    navigate('/join');
                }
            }).catch( (err) => {
                alert("다시 시도해주세요.");
                navigate('/join');
            })
    };
    return (
        <Container component="main" maxWidth="xs" sx={{mt:12,mb:30}}>
            <Paper variant="outlined"  
                sx={{ my: 3, p: 3, boxShadow: 1}}>
                <Box 
                    sx={{
                        marginTop: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                }}>
                    
                    <Typography  component="h1" variant="h5" sx={{ mb:5 }} >
                        <Link component={RouterLink} to="/" underline="none">반동이</Link>
                    </Typography>
                    <Box component="form"  onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <TextField
                            margin="normal"
                            name="userId"
                            label="아이디"
                            size="small"
                            value={userId}
                            onChange ={onUserIdHandler}
                            fullWidth
                            autoFocus
                            required 
                            sx={{ mb:-1 }}
                        />
                        <TextField
                            margin="normal"
                            name="password"
                            label="비밀번호"
                            type="password"
                            size="small"
                            value={password}
                            onChange ={onPasswordHandler}
                            fullWidth
                            required
                            autoComplete="new-password"
                            sx={{ mb:-1 }}
                        />
                        <TextField
                            margin="normal"
                            name="passwordCheck"
                            label="비밀번호 확인"
                            type="password"
                            size="small"
                            value={passwordCheck}
                            onChange ={onPasswordCheckHandler}
                            fullWidth
                            required
                            autoComplete="new-password"
                            sx={{ mb:-1 }}
                        />
                        <TextField
                            margin="normal"
                            name="email"
                            label="이메일"
                            type="email"
                            size="small"
                            value={email}
                            onChange ={onEmailHandler}
                            fullWidth
                            required
                            autoComplete="email"
                            sx={{ mb:-1 }}
                        />
                        <TextField
                            margin="normal"
                            name="username"
                            label="이름"
                            size="small"
                            value={username}
                            onChange ={onUsernameHandler}
                            fullWidth
                            required
                            sx={{ mb:-1 }}
                        />
                        <TextField
                            margin="normal"
                            name="nickname"
                            label="닉네임"
                            size="small"
                            value={nickname}
                            onChange ={onNicknameHandler}
                            fullWidth
                            required
                        />
                        <Grid container>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" size="small"/>}
                                    label={<Typography sx={{ fontSize: 12 }}>이메일 수신 동의<span style={{fontSize:'11px' , color: 'blue'}}>(선택)</span></Typography>}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" size="small"/>}
                                    label={<Typography  sx={{ fontSize: 12 }}>이용약관 및 개인정보취급방침에 동의합니다.<span style={{fontSize:'11px' , color: 'red'}}>(필수)</span></Typography>}
                                />
                            </Grid>
                        </Grid>
                        <Button type="submit" fullWidth variant="contained"
                        sx={{ mt : 3,mb:2 }}>
                            회원가입
                        </Button>
                        <Grid container justifyContent="flex-end" sx={{mb:1}}>
                            <Link component={RouterLink} to="/login" sx={{fontSize:14,mr:2}} underline="none">
                                로그인
                            </Link>
                        </Grid>
                    </Box>
                    {/* <Grid container>
                        <Grid item>
                            
                        </Grid>
                    </Grid> */}
                    <div style={{textAlign:"center", width:"100%", paddingBottom :14 ,paddingTop :20 , fontSize:14, color:'grey' , borderTop: '1px solid gainsboro'}}>
                        sns로 가입하기
                    </div>
                    <Stack spacing={2} direction="row">
                        <Button variant="outlined">카카오</Button>
                        <Button variant="outlined">네이버</Button>
                    </Stack>

                </Box>
            </Paper>
        </Container>
        


    )
}
