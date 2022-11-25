import {
    BrowserRouter as Router,
    Route,
    Routes
  } from 'react-router-dom';
import { RegisterPage } from '../pages/RegisterPage';
import { MainPage } from "../pages/MainPage";
import { LoginPage } from "../pages/LoginPage"

export function AppRouter() {
return (
  <Router>
    <Routes>
      <Route path="/" element={<MainPage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/register" element={<RegisterPage/>} />
    </Routes>
  </Router>
);} 