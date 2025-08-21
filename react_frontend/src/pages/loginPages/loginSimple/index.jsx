import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// MUI
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
// Icons
import LoginIcon from '@mui/icons-material/Login';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import GoogleIcon from '@mui/icons-material/Google';

function LoginSimple() {
  return (
    <Card
      hover={false}
      elevation={20}
      sx={{
        display: 'block',
        width: {
          xs: '95%',
          sm: '55%',
          md: '35%',
          lg: '25%',
        },
      }}
    >
      <Stack direction="column" spacing={5}>
        <div>
          <Typography variant="h1">SIGN IN</Typography>
          <Typography variant="body2" color="textSecondary">
            Signin using your account credentials.
          </Typography>
        </div>

        <LoginForm />
        <div>
          <Typography color="textSecondary" gutterBottom>
            OR SIGN IN WITH
          </Typography>

          <Stack
            direction="row"
            spacing={3}
            sx={{
              '& button': {
                color: '#fff',
              },
            }}
          >
            <Avatar component={ButtonBase} sx={{ bgcolor: '#4267B2' }} variant="rounded">
              <FacebookIcon />
            </Avatar>
            <Avatar component={ButtonBase} sx={{ bgcolor: '#1DA1F2' }} variant="rounded">
              <TwitterIcon />
            </Avatar>
            <Avatar component={ButtonBase} sx={{ bgcolor: '#DB4437' }} variant="rounded">
              <GoogleIcon />
            </Avatar>
          </Stack>
        </div>
        <Typography>
          ¿No tienes cuenta?{' '}
          <Link to="/pages/signup" variant="body2" component={RouterLink}>
            Registrate ahora
          </Link>
        </Typography>
      </Stack>
    </Card>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('submit');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1000);
  };
  return (
    <form onSubmit={handleSubmit}>
      <TextField autoFocus color="primary" name="Email" label="Email" margin="normal" variant="outlined" fullWidth />
      <TextField
        color="primary"
        name="password"
        type="password"
        margin="normal"
        label="Password"
        variant="outlined"
        fullWidth
      />
      <Link to="/resetPassword" component={RouterLink} color="tertiary.main">
        Forgot password?
      </Link>
      <Button
        sx={{
          mt: 2,
          textTransform: 'uppercase',
          color: 'primary.contrastText',
          ' &:not(:disabled)': {
            background: (theme) =>
              `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.tertiary.main} 100%)`,
          },
          '&:hover': {
            background: (theme) =>
              `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.tertiary.dark} 100%)`,
          },
        }}
        type="submit"
        variant="contained"
        disabled={isLoading}
        endIcon={
          isLoading ? (
            <CircularProgress
              color="secondary"
              size={25}
              sx={{
                my: 'auto',
              }}
            />
          ) : (
            <LoginIcon />
          )
        }
        fullWidth
        color="primary"
      >
        Sign In
      </Button>
    </form>
  );
}

export default LoginSimple;
