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
  const storedUser = localStorage.getItem('usertoken');
  const initialUser = storedUser ? JSON.parse(storedUser) : null;
  const [user, setUser] = useState(initialUser);
  const [show, setShow] = useState(false)
  // Trigger useEffect when user state changes to reflect the updated localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('usertoken', JSON.stringify(user)); // Save user to localStorage when it changes
    } else {
      localStorage.removeItem('usertoken'); // Remove token from localStorage if user logs out
    }
  }, [user]); // Dependency array makes sure it triggers when `user` state changes

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        {/* Your app components */}
        <ResponsiveAppBar setShow={setShow} />
        {/* The rest of your components */}
      </UserContext.Provider>

      <Routes>
        <Route exact path='/signin' element={<SignInForm />} />
        <Route exact path='/signup' element={<SignupForm />} />
        <Route path='/signup/verify' element={<VerificationCodeForm/>}/>
      </Routes>
    </>
  );
}

export default App;
