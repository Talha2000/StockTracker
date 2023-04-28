import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { StockContextProvider } from './context/stockContext';
import NavBar from "./components/NavBar/NavBar"
import DashBoard from "./pages/DashBoard";
import Login from './pages/Login';
import Register from './pages/Register';
import Portfolio from './pages/Portfolio';

function App() {
  return (
    <>
    <Router basename="/StockTrackerMain/META">
      <div className="app">
        <div className="container">
        <StockContextProvider>
          <NavBar/>
          <Routes>
          {/* <Route exact path={"/META"} element={<DashBoard/>} /> */}
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register/>} />
          <Route path='/Portfolio' element={<Portfolio/>} />
          <Route exact path='/:stockName' element={<DashBoard/>} />
          </Routes>
        </StockContextProvider>
        </div>
      </div>
      </Router>
    </>
  );
}

export default App;
