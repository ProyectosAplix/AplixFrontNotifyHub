import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import env from '../../../env-config';

import InputEditComponent from './InputsEditDialog';
import 'bootstrap/dist/css/bootstrap.min.css';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditUserModal({ open, handleClose }) {
  const [user, setUser] = useState('');
  const [data, setData] = useState({});
  const [reset, setReset] = useState(false);
  const getValueRefs = useRef({});

  useEffect(() => {
    if (open) {
      const company = sessionStorage.getItem('compañia');
      const currentUser = sessionStorage.getItem('currentUser');
      setUser(currentUser);
      if (!company) {
        window.location.href = '/login';
        return;
      }

      const fetchData = async () => {
        const data = {
          User: currentUser
        };
        try {
          const response = await axios.post(env.API_URL + 'GetAdministratorUser', data);
          const formattedData = response.data;
          setData(formattedData);
        } catch (error) {
          console.error("Error en traer la data del usuario", error.message);
        }
      };

      fetchData();
    } else {
      // Reset the values when the modal is closed
      setReset(true);
      setTimeout(() => setReset(false), 0);
    }
  }, [open]);

  const handleEdit = async () => {
    const rawData = {
      User: user,
      NewUser: getValueRefs.current["Usuario"].value,
      Name: getValueRefs.current["Nombre"].value,
      Pass: getValueRefs.current["Contraseña"].value,
      Company: getValueRefs.current["Empresa"].value
    };
  
    // Convert empty strings to null
    const data = Object.fromEntries(
      Object.entries(rawData).map(([key, value]) => [key, value.trim() === '' ? null : value])
    );
  
  
    try {
      const response = await axios.post(env.API_URL + 'EditAdministratorUsers', data);
      console.log('response:', response);
      console.log('status:', response.status);
      if (response.status === 200) {

          Swal.fire('Success', 'Usuario se ha editado exitosamente', 'success').then(() => {
            window.location.reload();
          });
        } 
       else {
        console.log('response:', response.data);
        Swal.fire('Error', 'Hubo un problema al editar el usuario', 'error');
      }
      handleClose();
    } catch (error) {
      console.log('error:', error.message);
      Swal.fire('Error', 'Hubo un problema al establecer la conexión', 'error');
      handleClose();
    }
    
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{`Edit ${user}`}</DialogTitle>
        <DialogContent>
          <div className='row'>
            <InputEditComponent
              getValue={getValueRefs}
              id="Nombre"
              label="Nombre:"
              type="text"
              placeholder=""
              Avalue={data.NOMBRE}
              reset={reset}
            />
            <InputEditComponent
              getValue={getValueRefs}
              id="Usuario"
              label="Usuario:"
              type="text"
              placeholder=""
              Avalue={user}
              reset={reset}
            />
            <InputEditComponent
              getValue={getValueRefs}
              id="Contraseña"
              label="Contraseña:"
              type="text"
              placeholder=""
              Avalue={data.PASSWORD}
              reset={reset}
            />
          </div>
          <div className='row'>
            <InputEditComponent
              getValue={getValueRefs}
              id="Empresa"
              label="Empresa:"
              type="text"
              placeholder=""
              Avalue={data.EMPRESA}
              reset={reset}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleEdit}>Agregar</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
