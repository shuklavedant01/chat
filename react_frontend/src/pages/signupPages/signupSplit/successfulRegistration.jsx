import { useNavigate } from 'react-router-dom';

// MUI Stuff
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// Api
// Contexts
import { useSignupData } from './signupContext';

function Verify() {
  const { userType } = useSignupData();

  const navigate = useNavigate();

  return (
    <Stack direction="column" spacing={2} alignItems="center" p="3%">
      <Typography variant="h6" gutterBottom>
        Activación de cuenta de usuario
      </Typography>

      <CheckCircleIcon
        sx={{
          color: 'success.main',
          fontSize: 90,
        }}
        color="success"
      />
      <Typography variant="subtitle1">
        <b>Elizabeth,</b> tu cuenta de tipo {userType} se ha activado correctamente.
      </Typography>
      <Typography variant="body1">
        Confirmaste tu cuenta correctamente con el correo <strong>elizabeth@slimtemplate.com</strong>, ya puedes usar tu
        nombre de usuario para iniciar sesión. Gracias por registrarte.
      </Typography>
      <Stack pt={3}>
        <Typography variant="caption" gutterBottom>
          Se recomienda completar los datos de tu perfil despues de iniciar sesión
        </Typography>
        <Button
          disableElevation
          variant="contained"
          color="success"
          onClick={() => {
            navigate('/pages/login');
          }}
        >
          Iniciar Sesión
        </Button>
      </Stack>
    </Stack>
  );
}

export default Verify;
