import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './layout/DashboardLayout';
import Home from './pages/home/Home';
import Users from './pages/userList/UserList';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />

        <Route path='/dashboard' element={<DashboardLayout/>}>
          <Route index element={<Home/>}/>
          <Route path='users' element={<Users/>}/>
        </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
