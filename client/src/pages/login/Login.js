import React, { useState } from 'react';
import axios from 'axios';
import { Button,
        TextField,
        Checkbox,
        FormControlLabel,
        Link,
        Grid,
        Typography,
        Box,
        Container,
        Paper
    } from '@mui/material';
import { Link as RouterLink, useNavigate} from "react-router-dom";
export default function Login() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // const onUserIdHandler = (e) => {
    //     setUserId(e.currentTarget.value);
    // }
    // const onPasswordHandler = (e) => {
    //     setPassword(e.currentTarget.value);
    // }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const body = {
            userId: userId,
            password: password,
            token : localStorage.getItem('token'),
        }
        axios.post("/auth/login",body)
            .then( (res) => {
                if (res.data.success){
                    localStorage.setItem('token',res.data.userId);
                    window.location.replace("/");
                } else{
                    alert(res.data.message);
                    navigate('/login');
                }
            }).catch( (err) => {
                alert("다시 시도해주세요.");
                navigate('/login');
            })
    };
    return (
        <Container component="main" maxWidth="xs" sx={{mt:12}}>
            <Paper variant="outlined"  
                sx={{ my: 3, p: 3, boxShadow: 1}}>
                <Box 
                    sx={{
                        marginTop: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                }}>
                    
                    <Typography component="h1" variant="h5" sx={{ mb:5 }} >
                        <Link component={RouterLink} to="/" underline="none">반동이</Link>
                    </Typography>
                    <Box component="form"  onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <TextField
                            margin="normal"
                            name="userId"
                            label="아이디"
                            size="small"
                            fullWidth
                            autoFocus
                            required 
                            sx={{ mb:-1 }}
                            onChange={e => setUserId(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            name="password"
                            label="비밀번호"
                            type="password"
                            size="small"
                            fullWidth
                            required
                            autoComplete="current-password"
                            onChange={e => setPassword(e.target.value)}
                        />
                    
                        <Grid container>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" size="small"/>}
                                    label={<Typography sx={{ fontSize: 14 }}>로그인 상태 유지</Typography>}
                                />
                            </Grid>
                        </Grid>
                        <Button type="submit" fullWidth variant="contained"
                        sx={{ mt : 3,mb:2 }}>
                            로그인
                        </Button>
                    </Box>
                    <Grid container>
                        <Grid item xs>
                            <Link href="/" sx={{fontSize:14}} underline="none">
                                비밀번호 찾기
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link component={RouterLink} to="/join" sx={{fontSize:14}} underline="none">
                                회원가입
                            </Link>
                        </Grid>   
                    </Grid>
                </Box>
            </Paper> 
        </Container>

    )
}
