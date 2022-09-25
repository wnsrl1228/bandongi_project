import React, { useState,useEffect,useRef } from 'react';
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
import { Link as RouterLink} from "react-router-dom";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
export default function ProfileUpdateComponent() {

    const [userId, setUserId] = useState("");
    const [nickname, setNickname] = useState("");
    const [profileImg, setProfileImg] = useState("");
    const [address , setAddress] = useState("");
    const [profileContent, setProfileContent] = useState("");
    const [profileBackgroundImg, setProfileBackgroundImg] = useState("");

    useEffect(() => {
      const fecthPost = async () => {
          try{
              const url = "/api/user/edit/";
              const res = await axios.get(url);
              setUserId(res.data.userId);
              setNickname(res.data.nickname);
              setProfileImg(res.data.profile_img);
              setProfileContent(res.data.profile_content);
              setAddress(res.data.address);
              setProfileBackgroundImg(res.data.profile_background_img)
          } catch (err){
              alert(err);
          }
      }
        fecthPost();
    },[]);

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


    const checkPostCancel = (e) => {
      var result = window.confirm("정말로 취소하시겠습니까?");
      if(result){
        window.location.href = '/profile/'+userId;
      }else{
          return false;
      }
    }

    const handleSubmit = (e) => {
      
      const body = {
          nickname: nickname,
          address : address,
          profile_content : profileContent,
          profile_img:profileImg,
          profile_background_img : profileBackgroundImg
      }
      axios.patch("/api/user/edit",body)
          .then( (res) => {
              if (res.data.success){
                  alert("프로필이 변경되었습니다.");
              } else{
                  alert("다시 시도해주세요.");
              }
              window.location = '/profile/edit';
          }).catch( (err) => {
              alert("다시 시도해주세요.");
              window.location = '/profile/edit';
          })
    };
    const profileRef = useRef(null);
    
    // 프로필 파일 업로드
    const handleChangeProfileImage = (e) => {
      const fileList = e.target.files;
      const formData = new FormData();
      formData.append("img", fileList[0])
      axios.post('/api/user/img', formData,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          if (res.status == 200) {
            document.getElementById('img-url').value = res.data.path;
            profileRef.current.src = res.data.path;
            setProfileImg(res.data.path);
          } else if (res.status == 201) {
            document.getElementById('img-url').value = ''
            profileRef.current.src = '';
            setProfileImg('');
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
    const profileBackgroundRef = useRef(null);
    // 프로필 배경 파일 업로드
    const handleChangeProfileBackgroundImage = (e) => {
      const fileList = e.target.files;
      const formData = new FormData();
      formData.append("img", fileList[0])
      axios.post('/api/user/img', formData,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          if (res.status == 200) {
            document.getElementById('img-url2').value = res.data.path;
            profileBackgroundRef.current.src = res.data.path;
            setProfileBackgroundImg(res.data.path);
          } else if (res.status == 201) {
            document.getElementById('img-url2').value = ''
            profileBackgroundRef.current.src = '';
            setProfileBackgroundImg('');
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }

    return (
        <Container  maxWidth="lg"  sx={{mt: {xs:10,sm:16,md:20},mb:60}} >
            <Container fixed sx={{px:5,ml:{md:3,sm:3}}}>
                <Grid container justifyContent="space-between">
                <Typography variant="h5" sx={{fontWeight:"bold"}} >
                    프로필 수정
                </Typography>
                </Grid>
            </Container>
            <Container fixed >
            <Box component="form"  onSubmit={handleSubmit} >
                <Grid container sx={{mb:3,p:2,pt:5}} alignItems="center" >
                    {/* 프로필 배경 이미지 변경  */}
                    <Grid item style={{backgroundColor:"grey",borderRadius:"10px"}} xs={12} height="200px" sx={{boxShadow:4}}>
                        <div className="img-preview">
                            <Avatar ref={profileBackgroundRef}  src={profileBackgroundImg|| ''} sx={{ bgcolor: "grey",height:"200px", width:"100%",borderRadius:"10px"}}  variant="square"/>
                            <input id="img-url2" type="hidden" name="url" value={profileBackgroundImg || ''}/>
                        </div>
                        <Grid container justifyContent="flex-end">
                        <div>
                            <label htmlFor="upload-photo2">
                                <input
                                  style={{ display: 'none' }}
                                  id="upload-photo2" type="file" accept={profileBackgroundImg || "image/*"} onChange={handleChangeProfileBackgroundImage}
                                />
                                <Button color="primary" variant="contained" component="span" sx={{px:1,ml:3,mt:1}} >
                                  배경 이미지 변경
                                </Button>
                            </label>
                        </div>
                        </Grid>
                    </Grid>

                  {/* 프로필 이미지 변경  */}
                    <Grid item sx={{ml:4,mt:-5}} >
                        <div className="img-preview">
                        <Avatar  ref={profileRef}  src={profileImg|| ''} sx={{boxShadow:3,height: '100px', width: '100px'}}style={{border: '5px solid white'}}></Avatar>
                          <input id="img-url" type="hidden" name="url" value={profileImg || ''}/>
                        </div>
                        <div>
                          <label htmlFor="upload-photo">
                            <input
                              style={{ display: 'none' }}
                              id="upload-photo" type="file" accept={profileImg || "image/*"} onChange={handleChangeProfileImage}
                            />
                            <Button color="primary" variant="contained" component="span" sx={{px:1,ml:3,mt:1}} >
                            <CameraAltIcon/>
                            </Button>
                          </label>
                        </div>
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
                      <Typography  variant="h6" fontWeight="Bold" >
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
                      <Typography  variant="h6" fontWeight="Bold" >
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

                    <Grid container  item  xs={12}  justifyContent="flex-end">
                      <Button type="submit" variant="contained"
                          sx={{ mt : 3,mb:2,mr:2}}>
                              프로필 변경
                      </Button>
                      <Button variant="contained" onClick={checkPostCancel} sx={{ mt : 3,mb:2,mr:2}}>
                        취소
                      </Button>
                    </Grid>

                    
                </Grid>
                </Box>
            </Container>
        </Container>


    )
}
