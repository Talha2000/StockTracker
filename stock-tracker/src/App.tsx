import { Navigate, Outlet, Route, Routes } from 'react-router';
import { NavBar } from './components/NavBar';
import { RequireAuth } from './components/RequireAuth';
import { Dashboard } from './pages/Dashboard';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

const Layout = () => (
  <>
    <NavBar />
    <main>
      <Outlet />
    </main>
  </>
);

export const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<RequireAuth />}>
        <Route index element={<Home />} />
        {/* The watchlist lives in the column beside every stock now; old links land there. */}
        <Route path="/watchlist" element={<Navigate to="/" replace />} />
        <Route path="/portfolio" element={<Navigate to="/" replace />} />
        <Route path="/:symbol" element={<Dashboard />} />
      </Route>
    </Route>
  </Routes>
);
