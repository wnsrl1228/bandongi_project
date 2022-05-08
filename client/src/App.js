import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Join from './pages/join/Join';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/join" element={<Join/>}/>
      </Routes>
    </Router>
  )
}

export default App;
