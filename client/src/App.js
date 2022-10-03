import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Join from './pages/join/Join';
import Post from './pages/post/Post';
import Profile from './pages/profile/Profile';
import ProfileUpdate from './pages/profileUpdate/ProfileUpdate'
import Category from './pages/category/Category'
import PostCreate from './pages/postCreate/PostCreate'
import PostUpdate from './pages/postUpdate/PostUpdate'
import FriendList from './pages/friendList/FriendList'
import Search from './pages/search/Search'
import PublicRoute from "./utils/PublicRoute"; 
import PrivateRoute from "./utils/PrivateRoute";

import ScrollToTop from './utils/ScrollToTop';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "GmarketSansMedium"
  }
});
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ScrollToTop/>
        <Routes>
          {/* <Route path="/" element={<Home/>}/> */}
          {/* <Route path="/" element={<Home/>}/> */}

          <Route exact path="/" element={<Home/>}/>
          <Route exact path="/search" element={<Search/>}/>
          <Route exact path="/post/create" element={ <PrivateRoute restricted={true}/>}>
            <Route exact path="/post/create" element={<PostCreate/>} />
          </Route>
          <Route exact path="/post/edit/:id" element={ <PrivateRoute restricted={true}/>}>
            <Route exact path="/post/edit/:id" element={<PostUpdate/>} />
          </Route>
          <Route exact path="/post/:id" element={ <PrivateRoute restricted={true}/>}>
            <Route exact path="/post/:id" element={<Post/>} />
          </Route>
          <Route exact path="/profile/edit" element={ <PrivateRoute restricted={true}/>}>
            <Route exact path="/profile/edit" element={<ProfileUpdate/>} />
          </Route>
          <Route exact path="/profile/:id" element={ <PrivateRoute restricted={true}/>}>
            <Route exact path="/profile/:id" element={<Profile/>} />
          </Route>
          <Route exact path="/friendList" element={ <PrivateRoute restricted={true}/>}>
            <Route exact path="/friendList" element={<FriendList/>} />
          </Route>
          <Route exact path="/login" element={ <PublicRoute restricted={true}/>}>
            <Route exact path="/login" element={<Login/>} />
          </Route>
          <Route exact path="/join" element={ <PublicRoute restricted={true}/>}>
            <Route exact path="/join" element={<Join/>} />
          </Route>
          <Route path="/show-off" element={<Category category="show-off"/>}/>
          <Route path="/friend-make" element={<Category category="friend-make"/>}/>
          <Route path="/qna" element={<Category category="qna"/>}/>
          <Route path="/tips" element={<Category category="tips"/>}/>
          {/* <PublicRoute restricted={false} component={Home} path="/" exact /> */}
          {/* <Route path="/login" element={<Login/>}/>
          <Route path="/join" element={<Join/>}/> */}
        </Routes>
      </Router>
    </ThemeProvider>
    
  )
}

export default App;
