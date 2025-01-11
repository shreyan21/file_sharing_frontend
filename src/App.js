import { useState, useEffect } from 'react';
import './App.css';
import ResponsiveAppBar from './components/Navbar.jsx';
import SignInForm from './components/Signin.jsx';
import SignupForm from './components/Signup.jsx';
import { UserContext } from './contexts/usercontext.js';
import { Routes, Route } from 'react-router-dom';
import VerificationCodeForm from './components/VerifyPage.jsx';

function App() {
  // Initialize user state from localStorage
  const [usertoken, setUserToken] = useState(localStorage.getItem('usertoken') ? JSON.parse(localStorage.getItem('usertoken')) : null)
  useEffect(() => {
    if (usertoken) {
      localStorage.setItem('usertoken', JSON.stringify(usertoken));
    } else {
      localStorage.removeItem('usertoken');
    }
  }, [usertoken]);

  return (
    <>
      <UserContext.Provider value={{ usertoken, setUserToken }}>
        {/* Your app components */}
        <ResponsiveAppBar />

        {/* The rest of your components */}

        <Routes>
          <Route exact path='/signin' element={<SignInForm />} />
          <Route exact path='/signup' element={<SignupForm />} />
          <Route path='/signup/verify' element={<VerificationCodeForm />} />
        </Routes>
      </UserContext.Provider>
    </>
  );
}

export default App;
