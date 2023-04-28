import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { StockContextProvider } from './context/stockContext';
import { AuthContextProvider } from './context/authContext';
import NavBar from "./components/NavBar/NavBar"
import DashBoard from "./pages/DashBoard";
import Login from './pages/Login';
import Register from './pages/Register';
import Portfolio from './pages/Portfolio';
// for _redirects 
// This line will redirect all requests to /api/* 
// to https://stocktrackerapi.onrender.com/api/*. 
//The :splat is a wildcard that matches any remaining path after /api/.

function App() {
  return (
    <>
    <Router>
      <AuthContextProvider>
        <div className="app">
          <div className="container">
            <StockContextProvider>
              <NavBar/>
              <Routes>
              <Route path='/' element={<DashBoard/>} />
              <Route path='/:stockName' element={<DashBoard/>} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register/>} />
              <Route path='/Portfolio' element={<Portfolio/>} />
              </Routes>
            </StockContextProvider>
          </div>
        </div>
      </AuthContextProvider>
    </Router>
  </>
  );
}

export default App;
