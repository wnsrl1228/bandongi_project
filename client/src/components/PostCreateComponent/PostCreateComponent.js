import React, { useState,useEffect} from 'react';

import { 
    Grid,
    Typography,
    Link,
    TextField,
    Button,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    Container
} from '@mui/material';
import axios from "axios";
import { Link as RouterLink} from "react-router-dom";
import { Box } from '@mui/system';

export default function PostComponent() {

    //카테고리
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState(''); 
    const [content, setContent] = useState(''); 

    const handleChange = (event) => {
      setCategory(event.target.value);
    };
    const onTitleHandler = (e) => {
      setTitle(e.currentTarget.value);
    } 
    const onContentHandler = (e) => {
      setContent(e.currentTarget.value);
    } 

    useEffect(() => {

    },[]);


    const handleSubmit = (e) => {
      
      const body = {
        title: title,
        content : content,
        category : category,
    }
      axios.post("/post/create",body)
          .then( (res) => {
              if (res.data.success){
                  alert("게시글이 생성되었습니다.");
                  const url = "/post/"+res.data.postId;
                  window.location = url;
              } else{
                  alert("다시 시도해주세요.");
                  window.location = "/post/create";
              }
          }).catch( (err) => {
              alert("다시 시도해주세요.");
              window.location = "/post/create";
          })
    };

    const checkPostCancel = (e) => {
      var result = window.confirm("정말로 취소하시겠습니까?");
      if(result){
        window.location.href ="/";
      }else{
          return false;
      }
    }
    return (
      <Container  maxWidth="lg" sx={{mt: {xs:10,sm:16,md:20},mb:100}} >
      <Container fixed style={{border: '1px solid #d2d2d2',borderRadius:"10px",backgroundColor:"#FFFFFF"}} sx={{p:5,boxShadow:4}}>
      <Box component="form"  onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container sx={{mb:3,p:2}} alignItems="center">
              <Grid item sx={{ml:3}} xs={12}>
                <Typography  variant="h5" fontWeight="Bold" style={{display:"inline-block", margin:"5px"}}>
                  <span >카테고리 :</span>
                </Typography>
                <FormControl sx={{ ml:2 , minWidth: 220 }} size="small">
                    <InputLabel id="demo-simple-select-label">카테고리를 선택해주세요.</InputLabel>
                    <Select
                      required
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={category}
                      label="category"
                      onChange={handleChange}
                    >
                      <MenuItem value={'friend-make'}>반려동물 친구 만들기</MenuItem>
                      <MenuItem value={'show-off'}>내 자식 자랑하기</MenuItem>
                      <MenuItem value={'qna'}>묻고 답하기</MenuItem>
                      <MenuItem value={'tips'}>꿀팁 전수</MenuItem>
                    </Select>
                  </FormControl>
              </Grid>
              <Grid item  sx={{ml:3,mt:4}} xs={12}>
                <Typography  variant="h5" fontWeight="Bold" >
                  <span style={{display:"inline-block", margin:"5px"}}>제목 :</span>
                  <TextField
                        margin="normal"
                        placeholder="제목을 입력해주세요."
                        fullWidth
                        size="small"
                        required 
                        multiline
                        onChange ={onTitleHandler}
                        autoComplete='off'
                        sx={{width:"auto",ml:2,mt:0}}
                      />
                </Typography>
              </Grid>
              
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
                        rows={10}
                        sx={{mt:0}}
                      />
                </Typography>
              </Grid>

              <Grid container  item  xs={12} sx={{mt:4}} justifyContent="flex-end">
                <Button type="submit" variant="contained" sx={{ mt : 3,mb:2,mr:2}}>
                        게시물 등록
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
