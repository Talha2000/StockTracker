import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { StockContextProvider } from './context/stockContext';
import { AuthContextProvider } from './context/authContext';
import NavBar from "./components/NavBar/NavBar"
import DashBoard from "./pages/DashBoard";
import Login from './pages/Login';
import Register from './pages/Register';
import Portfolio from './pages/Portfolio';
// import { ThemeContextProvider } from './context/themeContext';
// for _redirects 
// This line will redirect all requests to /api/* 
// to https://stocktrackerapi.onrender.com/api/*. 
//The :splat is a wildcard that matches any remaining path after /api/.
import { ThemeContextProvider } from './context/themeContext';
function App() {
  return (
    <>
    <Router>
        <AuthContextProvider>
            {/* <div className="app">
              <div className="container"> */}
                  <StockContextProvider>
                    <ThemeContextProvider>
                      <NavBar/>
                      <Routes>
                      <Route path='/' element={<DashBoard/>} />
                      <Route path='/:stockName' element={<DashBoard/>} />
                      <Route path='/login' element={<Login />} />
                      <Route path='/register' element={<Register/>} />
                      <Route path='/Portfolio' element={<Portfolio/>} />
                      </Routes>
                      {/* <ThemeButton/> */}
                    </ThemeContextProvider>
                  </StockContextProvider>
              {/* </div>
            </div> */}
          </AuthContextProvider>
      
    </Router>
  </>
  );
}

export default App;
