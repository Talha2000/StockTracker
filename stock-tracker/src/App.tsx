import { Navigate, Outlet, Route, Routes } from 'react-router';
import { NavBar } from './components/NavBar';
import { RequireAuth } from './components/RequireAuth';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Watchlist } from './pages/Watchlist';

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
        <Route index element={<Navigate to="/META" replace />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/portfolio" element={<Navigate to="/watchlist" replace />} />
        <Route path="/:symbol" element={<Dashboard />} />
      </Route>
    </Route>
  </Routes>
);
