import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Homescreen from './screens/Homescreen';
import Bookingscreen from './screens/Bookingscreen'
import Registerscreen from './screens/Registerscreen';
import Longinscreen from './screens/Longinscreen';
import Profilescreen from './screens/Profilescreen';
import Adminscreen from './screens/Adminscreen';
import Landingscreen from './screens/Landingscreen';
function App() {
  return (
    <div className="App">
      <Navbar/>
      <BrowserRouter>
        <Routes>
        <Route path="/home" element={<Homescreen/>}></Route>
        <Route path="/book/:_id/:fromdate/:todate" element={<Bookingscreen/>}></Route>
        <Route path="/register" element={<Registerscreen/>}></Route>
        <Route path="/login" element={<Longinscreen/>}></Route>
        <Route path="/profile" element={<Profilescreen/>}></Route>
        <Route path="/admin" element={<Adminscreen/>}></Route>
        <Route path="/" element={<Landingscreen/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
