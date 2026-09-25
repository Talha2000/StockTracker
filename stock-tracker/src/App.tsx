import { Navigate, Outlet, Route, Routes } from 'react-router';
import { NavBar } from './components/NavBar';
import { RequireAuth } from './components/RequireAuth';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Portfolio } from './pages/Portfolio';
import { Register } from './pages/Register';

const Layout = () => (
  <>
    <NavBar />
    <main className="pt-20">
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
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/:symbol" element={<Dashboard />} />
      </Route>
    </Route>
  </Routes>
);
