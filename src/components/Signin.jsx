import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Box, CircularProgress, FormHelperText } from '@mui/material';

const SignInForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    const result = await fetch('http://localhost:3200/user/signin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    const data = await result.json();
    localStorage.setItem("usertoken", JSON.stringify(data.token));
    if (result.status >= 200) {
      console.log(data);
      document.body.innerHTML = `Successfully logged in `;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',  // Full viewport height
        padding: 3,
        backgroundColor: '#f4f4f4',
        boxSizing: 'border-box',  // Prevents box size issues
        paddingTop: '60px', // Push the form down to avoid navbar overlap
        overflow: 'hidden',  // Prevent scrolling
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '400px',  // Limit width of form
          minWidth: '300px',  // Prevent it from becoming too narrow on mobile
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: '#fff',
          maxHeight: '90vh', // Ensure form fits within the viewport on mobile
          overflow: 'auto', // In case content overflows, allow scroll only within form
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
