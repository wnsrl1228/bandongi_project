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
import { Link as RouterLink,useNavigate} from "react-router-dom";
import { Box } from '@mui/system';

export default function PostComponent(props) {

    //카테고리  시작
    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
      setAge(event.target.value);
    };
    //카테고리  끝

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


    const handleSubmit = (e) => {
      
      const body = {

      }
      // axios.patch("/user/edit",body)
      //     .then( (res) => {
      //         if (res.data.success){
      //             alert("프로필이 변경되었습니다.");
      //             navigate('/profile/edit');
      //         } else{
      //             alert(res.data.message);
      //             navigate("/");
      //         }
      //     }).catch( (err) => {
      //         alert("다시 시도해주세요.");
      //         navigate("/profile/edit");
      //     })
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
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={age}
                      label="Age"
                      onChange={handleChange}
                    >
                      <MenuItem value={10}>반려동물 친구 만들기</MenuItem>
                      <MenuItem value={20}>내 자식 자랑하기</MenuItem>
                      <MenuItem value={30}>묻고 답하기</MenuItem>
                      <MenuItem value={30}>꿀팁 전수</MenuItem>
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
                        // onChange ={onAddressHandler}
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
                        // onChange = {onProfileContentHandler}
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
