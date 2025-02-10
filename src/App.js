import { useState, useEffect } from 'react';
import './App.css';
import ResponsiveAppBar from './components/Navbar.jsx';
import SignInForm from './components/Signin.jsx';
import SignupForm from './components/Signup.jsx';
import { UserContext } from './contexts/usercontext.js';
import { Routes, Route } from 'react-router-dom';
import VerificationCodeForm from './components/VerifyPage.jsx';
import FilePage from './components/Files.jsx';
import FileViewer from './components/FileViewer.jsx'; // New component
import { PermissionContext } from './contexts/permissioncontext.js';

function App() {
  const [usertoken, setUserToken] = useState(localStorage.getItem('usertoken') ? JSON.parse(localStorage.getItem('usertoken')) : null);
  const [permission, setPermission] = useState(localStorage.getItem('permission') ? JSON.parse(localStorage.getItem('permission')) :[]);

  useEffect(() => {
    console.log('User token has changed:', usertoken);

    if (usertoken) {
      localStorage.setItem('usertoken', JSON.stringify(usertoken));
      localStorage.setItem('permission', JSON.stringify(permission));
    } else {
      localStorage.removeItem('usertoken');
      localStorage.removeItem('permission');
    }
  }, [usertoken]);

  return (
    <>
      <UserContext.Provider value={{ usertoken, setUserToken }}>
        <PermissionContext.Provider value={{ permission, setPermission }}>
          <ResponsiveAppBar />
          <div className="main-content">  {/* Add this wrapper */}
            {usertoken&&<FilePage/>}
            <Routes>
              {/* <Route exact path="/file" element={<FilePage />} /> */}
              <Route path="/file/:filename" element={<FileViewer />} />
              <Route exact path="/signin" element={<SignInForm />} />
              <Route exact path="/signup" element={<SignupForm />} />
              <Route path="/signup/verify" element={<VerificationCodeForm />} />
            </Routes>
          </div>
        </PermissionContext.Provider>
      </UserContext.Provider>
    </>
  );
}

export default App;