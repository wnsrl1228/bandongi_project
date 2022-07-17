import React, { useState,useEffect} from 'react';
import { 
    Grid,
    Container,
    Typography,
    Avatar,
    Link,
    Box,
    Button,
    TextField
} from '@mui/material';

import axios from "axios";
import { Link as RouterLink,useNavigate} from "react-router-dom";

export default function ProfileUpdateComponent() {

    const [userId, setUserId] = useState("");
    const [nickname, setNickname] = useState("");
    const [profileImg, setProfileImg] = useState("");
    const [address , setAddress] = useState("");
    const [profileContent, setProfileContent] = useState("");

    useEffect(() => {
      const fecthPost = async () => {
          try{
              const url = "/user/edit/";
              const res = await axios.get(url);
              setUserId(res.data.userId);
              setNickname(res.data.nickname);
              setProfileImg(res.data.profile_img);
              setProfileContent(res.data.profile_content);
              setAddress(res.data.address);


          } catch (err){
              alert(err);
          }
      }
        fecthPost();
    },[]);

    const navigate = useNavigate();

    const onNicknameHandler = (e) => {
        setNickname(e.currentTarget.value);
    }
    const onProfileImgHandler = (e) => {
      setProfileImg(e.currentTarget.value);
    }
    const onAddressHandler = (e) => {
      setAddress(e.currentTarget.value);
    } 
    const onProfileContentHandler = (e) => {
      setProfileContent(e.currentTarget.value);
    } 



    const handleSubmit = (e) => {
      
      const body = {
          nickname: nickname,
          address : address,
          profileContent : profileContent,
          profileImg:profileImg
      }

      axios.patch("/user/edit",body)
          .then( (res) => {
              if (res.data.success){
                  alert("프로필이 변경되었습니다.");
                  navigate('/profile/edit');
              } else{
                  alert(res.data.message);
                  navigate("/");
              }
          }).catch( (err) => {
              alert("다시 시도해주세요.");
              navigate("/profile/edit");
          })
    };

    return (
        <Container  maxWidth="lg" sx={{mt: {xs:10,sm:16,md:20},mb:100}} >
            <Container fixed>
            <Box component="form"  onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container sx={{mb:3,p:2,pt:5}} alignItems="center">
              
                    <Grid item style={{backgroundColor:"grey",borderRadius:"10px"}} xs={12} height="200px" sx={{boxShadow:4}}>
                        <img></img>
                    </Grid>

                    <Grid item sx={{ml:4,mt:-5}} >
                        <Link component={RouterLink} to={{pathname:`/profile/${userId}`}}>
                            <Avatar src={profileImg} sx={{boxShadow:3}}style={{width:"100px",height:"100px",border: '5px solid white'}}></Avatar>
                        </Link>
                    </Grid>

                    <Grid item  sx={{ml:2,mt: {xs:2}}} xs={10}  sm={7} md={8} lg={9}>
                        <Grid container justifyContent="space-between">
                            <Grid item>
                            <TextField
                              value={nickname || ''}
                              margin="normal"
                              label="닉네임"
                              fullWidth
                              multiline
                              required 
                              onChange ={onNicknameHandler}
                              autoComplete='off'
                              sx={{ mb:-1 }}
                            />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item  sx={{ml:3,mt:4}} xs={12}>
                      <Typography  variant="h5" fontWeight="Bold" >
                        사는 곳 :
                        <TextField
                              margin="normal"
                              fullWidth
                              size="small"
                              required 
                              multiline
                              value={address || ''}
                              onChange ={onAddressHandler}
                              autoComplete='off'
                              sx={{width:"auto",ml:2,mt:0}}
                            />
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
                        <TextField
                              margin="normal"
                              value={profileContent || ''}
                              onChange = {onProfileContentHandler}
                              autoComplete='off'
                              fullWidth
                              size="small"
                              required 
                              multiline
                              rows={10}
                              sx={{mt:0}}
                            />
                        </Typography>
                      </Container>
                    </Grid>

                    <Grid container  item  xs={12} sx={{mt:4}} justifyContent="flex-end">
                      <Button type="submit" variant="contained"
                          sx={{ mt : 3,mb:2,mr:2}}>
                              프로필 변경
                      </Button>
                    </Grid>

                    
                </Grid>
                </Box>
            </Container>
        </Container>


    )
}
