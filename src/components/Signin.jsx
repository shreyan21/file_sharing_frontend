import React, { useContext, useState } from 'react';
import { TextField, Button, Grid, Typography, Box, CircularProgress, FormHelperText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/usercontext.js';
import { PermissionContext } from '../contexts/permissioncontext.js';


const SignInForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const{setUserToken}=useContext(UserContext)
  const {setPermission}=useContext(PermissionContext)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    const result = await fetch('http://localhost:3200/user/signin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    if (result.status === 404) {
      setIsLoading(false)
      setErrorMessage('Not registered')
    }
    else if (result.status === 401) {
      setIsLoading(false)
      setErrorMessage('Invalid credentials')
    }
    if (result.status === 200) {
      const data = await result.json();
     
     setUserToken(data.token)
     setPermission(data.permissionsObject)

     navigate('/')
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: 3,
        backgroundColor: '#f4f4f4',
        boxSizing: 'border-box',
        paddingTop: '60px',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '400px',
          minWidth: '300px',
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: '#fff',
          maxHeight: '90vh',
          overflow: 'hidden',
          // In case content overflows, allow scroll only within form
        }}
      >
        <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: 2 }}>
          Sign In
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Email Field */}
            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Password Field */}
            <Grid item xs={12}>
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errorMessage && <FormHelperText sx={{ color: 'red', fontSize: '0.875rem' }}>{errorMessage}</FormHelperText>}
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 2 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign In'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default SignInForm;
