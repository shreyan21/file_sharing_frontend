import { useState, useEffect } from 'react';
import './App.css';
import ResponsiveAppBar from './components/Navbar.jsx';
import SignInForm from './components/Signin.jsx';
import SignupForm from './components/Signup.jsx';
import { UserContext } from './contexts/usercontext.js';
import { Routes, Route } from 'react-router-dom';
import VerificationCodeForm from './components/VerifyPage.jsx';
import FilePage from './components/Files.jsx';
import { PermissionContext } from './contexts/permissioncontext.js';

function App() {
  // Initialize user state from localStorage
  const [usertoken, setUserToken] = useState(localStorage.getItem('usertoken') ? JSON.parse(localStorage.getItem('usertoken')) : null)
  const [permission, setPermission] = useState(localStorage.getItem('permission')?JSON.parse(localStorage.getItem('permission')):[])
  useEffect(() => {
    // You can put any logic you want to trigger when usertoken changes
    console.log('User token has changed:', usertoken);

    // Optionally save the token to localStorage whenever it changes
    if (usertoken) {
      localStorage.setItem('usertoken', JSON.stringify(usertoken));
      localStorage.setItem('permission',JSON.stringify(permission))
    } else {
      localStorage.removeItem('files')
      localStorage.removeItem('usertoken');
      localStorage.removeItem('permission')
    }
  }, [usertoken]);
  return (
    <>
      <UserContext.Provider value={{ usertoken, setUserToken }}>
        <PermissionContext.Provider value={{ permission, setPermission }}>
       
        <ResponsiveAppBar />
        {usertoken && <FilePage />}
        <Routes>
          <Route exact path='/signin' element={<SignInForm />} />
          <Route exact path='/signup' element={<SignupForm />} />
          <Route path='/signup/verify' element={<VerificationCodeForm />} />
        </Routes>
      </PermissionContext.Provider>
      </UserContext.Provider>
        
    
    </>
  );
}

export default App;
