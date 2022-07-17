import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Join from './pages/join/Join';
import Post from './pages/post/Post';
import Profile from './pages/profile/Profile';
import ProfileUpdate from './pages/profileUpdate/ProfileUpdate'
import PublicRoute from "./utils/PublicRoute"; 
import PrivateRoute from "./utils/PrivateRoute";

import ScrollToTop from './utils/ScrollToTop';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
      <ScrollToTop/>
      <Routes>
        {/* <Route path="/" element={<Home/>}/> */}
        {/* <Route path="/" element={<Home/>}/> */}

        <Route exact path="/" element={<Home/>}/>

        <Route exact path="/post/:id" element={ <PrivateRoute restricted={true}/>}>
          <Route exact path="/post/:id" element={<Post/>} />
        </Route>
        <Route exact path="/profile/edit" element={ <PrivateRoute restricted={true}/>}>
          <Route exact path="/profile/edit" element={<ProfileUpdate/>} />
        </Route>
        <Route exact path="/profile/:id" element={ <PrivateRoute restricted={true}/>}>
          <Route exact path="/profile/:id" element={<Profile/>} />
        </Route>
        <Route exact path="/login" element={ <PublicRoute restricted={true}/>}>
          <Route exact path="/login" element={<Login/>} />
        </Route>
        {/* <PublicRoute restricted={false} component={Home} path="/" exact /> */}
        <Route path="/login" element={<Login/>}/>
        <Route path="/join" element={<Join/>}/>
      </Routes>
    </Router>
  )
}

export default App;
