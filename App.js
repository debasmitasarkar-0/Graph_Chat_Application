import './CSS/style.css';
import Home from './components/home';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import { useEffect } from 'react';
import ModeState from './context/Dark_lightMode/modeState';
import io from 'socket.io-client';

let socket = io.connect('http://localhost:5000');
// let socket = io.connect('http://192.168.0.3:5000');

import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";


function App() {
  //This works for log out the user when user close the window.
  useEffect(() => {
    const handleTabClose = event => {
      // event.preventDefault();
      // localStorage.removeItem('token');
      // localStorage.removeItem('email');
      // localStorage.removeItem('user_id');
      localStorage.clear();
      return (event.returnValue =
        'Are you sure you want to exit?');
    };

    window.addEventListener('beforeunload', handleTabClose);

    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, []);


  return (
    <>
    {/* All states will be available to all components between this NoteState. */}
      <ModeState> 
        <Router>
        <Navbar/>
          <div>
          <Routes>
            <Route exact path='/' element={<Home socket = {socket}/>} ></Route>

            <Route exact path='/login' element={<Login socket = {socket}/>} ></Route>

            <Route exact path='/signup' element={<Signup socket = {socket} />} ></Route>

            <Route path="*" element={<MatchAllRoute />} />
          </Routes>
          </div>
        </Router>
      </ModeState>
    </>
  );
}


export default App;


function MatchAllRoute() {
  return <h2>The requested page does not exist</h2>;
}