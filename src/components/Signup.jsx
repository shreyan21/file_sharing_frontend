import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      validatePassword(value);
    }
  };

  // Async function to validate password
  const validatePassword = async (password) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate async delay

    const lengthValid = password.length >= 8;
    const hasDigit = /\d/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!lengthValid) {
      setPasswordErrorMessage('Password must be at least 8 characters long.');
      setPasswordValid(false);
    } else if (!hasDigit) {
      setPasswordErrorMessage('Password must contain at least one digit.');
      setPasswordValid(false);
    } else if (!hasUpperCase) {
      setPasswordErrorMessage('Password must contain at least one uppercase letter.');
      setPasswordValid(false);
    } else if (!hasLowerCase) {
      setPasswordErrorMessage('Password must contain at least one lowercase letter.');
      setPasswordValid(false);
    } else if (!hasSpecialChar) {
      setPasswordErrorMessage('Password must contain at least one special character.');
      setPasswordValid(false);
    } else {
      setPasswordErrorMessage('');
      setPasswordValid(true);
    }
    setIsLoading(false);
  };
  const navigate=useNavigate()

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem('name', JSON.stringify(formData.name))
    localStorage.setItem('email', JSON.stringify(formData.email))
    localStorage.setItem('password', JSON.stringify(formData.password))
    if (formData.phone) {
      localStorage.setItem('phone', JSON.stringify(formData.phone))
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
    } else {
      // Handle form submission logic here (e.g., API call)
      alert('Form submitted');
      // const result=await fetch('http://localhost:3200/user/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: formData.name, email: formData.email, phone: formData.phone, password: formData.password }) })
      const result=await fetch('http://localhost:3200/user/add',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:formData.email})})
      if(result.status===200){
        navigate('/signup/verify')
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: 2,
        backgroundColor: '#f4f4f4',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '400px',
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: '#fff',
          maxHeight: '90vh',
          overflow: 'hidden',
        }}
      >
        <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: 2 }}>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Name Field */}
            <Grid item xs={12}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

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

            {/* Phone Field */}
            <Grid item xs={12}>
              <TextField
                label="Phone"
                variant="outlined"
                fullWidth
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
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
                error={!passwordValid}
                helperText={passwordErrorMessage}
                required
              />
              {isLoading && <CircularProgress size={24} sx={{ marginLeft: 1 }} />}
            </Grid>

            {/* Confirm Password Field */}
            <Grid item xs={12}>
              <TextField
                label="Confirm Password"
                variant="outlined"
                fullWidth
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 2 }}
                disabled={!passwordValid || formData.password !== formData.confirmPassword}
              >
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default SignupForm;
