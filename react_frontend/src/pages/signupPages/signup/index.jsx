import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { strengthColor, strengthIndicator } from '@/utils/helpers/passwordStrength';
// MUI
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
// Icons
import LoginIcon from '@mui/icons-material/Login';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';

// assets
import logo from '@/assets/images/logo/png/Color_logo_nobg.png';
import Google from '@/assets/icons/social-google.svg';

function SignupPage() {
  return (
    <Card
      elevation={20}
      sx={{
        display: 'block',
        width: {
          xs: '95%',
          sm: '450px ',
          md: '50%',
          lg: '30%',
        },
      }}
      hover={false}
    >
      <Stack direction="column" spacing={3}>
        <Box component="img" src={logo} width="60%" mx="auto" alt="slim logo" />
        <div>
          <Typography variant="h1" fontWeight="light">
            Get Started!
          </Typography>
          <Typography variant="body2" color="textSecondary">
            It&#39;s free to signup and only takes a minute.
          </Typography>
        </div>

        <LoginForm />
        <Divider sx={{ color: 'text.secondary' }}>or signup using</Divider>
        <Stack spacing={1}>
          <SocialButton
            icon={
              <Box
                sx={{
                  mr: {
                    xs: 1,
                    sm: 2,
                  },
                }}
                width={16}
                height={16}
                component="img"
                src={Google}
                alt="google"
              />
            }
            title="Sign Up Using Google"
          />
          <SocialButton
            icon={
              <FacebookIcon
                sx={{
                  color: '#4267B2',
                  mr: {
                    xs: 1,
                    sm: 2,
                  },
                }}
              />
            }
            title="Sign Up Using Facebook"
          />
          <SocialButton
            icon={
              <TwitterIcon
                sx={{
                  color: '#1DA1F2',
                  mr: {
                    xs: 1,
                    sm: 2,
                  },
                }}
              />
            }
            title="Sign Up Using Twitter"
          />
        </Stack>
        <Typography>
          Already have an account?{' '}
          <Link to="/pages/login" component={RouterLink}>
            Sign In
          </Link>
        </Typography>
      </Stack>
    </Card>
  );
}

function SocialButton({ title, icon }) {
  return (
    <Button
      disableElevation
      fullWidth
      size="small"
      variant="outlined"
      sx={{
        color: (theme) => (theme.palette.mode === 'dark' ? 'text.primary' : 'grey.700'),
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'background.default' : theme.palette.grey[50]),
        borderColor: 'border',
      }}
      to="/home"
      component={RouterLink}
    >
      {icon}
      {title}
    </Button>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formPassword, setFormPassword] = useState('');
  const [level, setLevel] = useState(0);

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('submit');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1000);
  };

  useEffect(() => {
    changePassword('123456');
  }, []);
  return (
    <form onSubmit={handleSubmit}>
      <TextField
        color="primary"
        autoFocus
        name="nickname"
        label="Username"
        margin="normal"
        variant="outlined"
        fullWidth
      />
      <TextField
        color="primary"
        name="password"
        type="password"
        margin="normal"
        label="Password"
        variant="outlined"
        value={formPassword}
        onChange={(e) => {
          setFormPassword(e.target.value);
          changePassword(e.target.value);
        }}
        fullWidth
      />
      <Box>
        <Box style={{ backgroundColor: level?.color }} sx={{ width: 85, height: 8, borderRadius: '7px' }} />
        <Typography variant="body2" color="textSecondary">
          {level?.label}&nbsp;
        </Typography>
      </Box>

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
        Sign Up
      </Button>
    </form>
  );
}

export default SignupPage;
