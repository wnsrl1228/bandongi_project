import React, { useState } from 'react';
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
import { Link as RouterLink } from "react-router-dom";
export default function Join() {

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
                    
                    <Typography  component="h1" variant="h5" sx={{ mb:5 }} >
                        <Link component={RouterLink} to="/" underline="none">반동이</Link>
                    </Typography>
                    <TextField
                        margin="normal"
                        name="userId"
                        label="아이디"
                        size="small"
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
                        fullWidth
                        required
                        autoComplete="new-password"
                        sx={{ mb:-1 }}
                    />
                    <TextField
                        margin="normal"
                        name="password"
                        label="비밀번호 확인"
                        type="password"
                        size="small"
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
                        fullWidth
                        required
                        sx={{ mb:-1 }}
                    />
                    <TextField
                        margin="normal"
                        name="nickname"
                        label="닉네임"
                        size="small"
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
