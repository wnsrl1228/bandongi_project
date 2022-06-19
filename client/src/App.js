import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Join from './pages/join/Join';

import PublicRoute from "./utils/PublicRoute"; 
// import PrivateRoute from "./utils/PrivateRoute";


import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home/>}/> */}
        {/* <Route path="/" element={<Home/>}/> */}

        <Route exact path="/" element={<Home/>}/>

        <Route exact path="/login" element={ <PublicRoute restricted={true}/>}>
          <Route exact path="/login" element={<Login/>}/>
        </Route>
        {/* <PublicRoute restricted={false} component={Home} path="/" exact /> */}
        <Route path="/login" element={<Login/>}/>
        <Route path="/join" element={<Join/>}/>
      </Routes>
    </Router>
  )
}

export default App;
