import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Container, Card, CardHeader } from '@mui/material';
import adminApi from 'src/store/services/adminApi';
import { toast } from 'react-toast';
import { useDispatch } from 'react-redux';
import { setUser } from 'src/store/slices/adminSlice';
import { useNavigate } from 'react-router';
import { custom_error } from 'src/models/auth_type';

const LoginPage: React.FC = () => {
  const {useLoginMutation} = adminApi;
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [login, {isLoading}] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async(e: React.FormEvent) => {
     e.preventDefault();
     try {
       const newFormData = new FormData();

       if (!email) {
         toast.error('Please enter your email.');
         return;
       }

       if (!password) {
         toast.error('Please enter your password.');
         return;
       }
       newFormData.append('email', email);
       newFormData.append('password', password);

       const res = await login(newFormData);
       const {data, error} = res;
       console.log("🚀 ~ handleLogin ~ res:", res)
       if (data) {
         console.log("🚀 ~ handleLogin ~ res.data:", data)
         const { user, tokens } = data;
         dispatch(setUser({ user, token: tokens.access.token }));
         navigate('/dashboard');
       }

       if (error ) {
         toast.error((error as custom_error).data.message);
       }
     } catch (error: any) {
       // Check if it's a response error (such as 401)
       if (error) {
         const status = error.status;
         const message = error.message || 'An error occurred';

         // Handle specific status codes
         if (status === 401) {
           toast.error('Unauthorized: Invalid email or password.');
         }
       } else {
         // Handle generic errors (network issues, etc.)
         toast.error('Something went wrong. Please try again later.');
       }
     }
  };

  return (
    <Container
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}
      component="main"
      maxWidth="xs"
    >
      <Card>
        <Box
          sx={{
            marginTop: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px'
          }}
        >
          <Typography component="h1" variant="h2">
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin(e);
            }}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Card>
    </Container>
  );
};

export default LoginPage;
