import React, { useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import env from '../../env-config';

import InputComponent from './InputsDialog';
import 'bootstrap/dist/css/bootstrap.min.css';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({ open, handleClose }) {
  const getValueRefs = useRef({});

  const handleAdd = async () => {
    const data = {
      User: getValueRefs.current["Usuario"].value,
      Name: getValueRefs.current["Nombre"].value,
      Pass: getValueRefs.current["Contraseña"].value,
      Company: getValueRefs.current["Empresa"].value
    };


    try {
      console.log('data:', data);
      const response = await axios.post(env.API_URL+'AddAdministratorUsers?', data);
      if (response.status === 200) {
        const statusMessage = response.data;
        if (statusMessage === 'OK') {
          Swal.fire('Success', 'Usuario agregado exitosamente', 'success').then(() => {
            window.location.reload();
          });
        } else if (statusMessage === 'Error: Usuario Existente.') {
          Swal.fire('Error', 'El usuario ya existe', 'error');
        } else {
          Swal.fire('Error', 'Hubo un problema al agregar el usuario', 'error');
        }
      } else {
        console.log('response:', response.data );
        Swal.fire('Error', 'Hubo un problema al agregar el usuario', 'error');
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
        <DialogTitle>{"Agregar Usuario Administrador"}</DialogTitle>
        <DialogContent>
          <div className='row'>
            <InputComponent
              getValue={getValueRefs}
              id="Nombre"
              label="Nombre:"
              type="text"
              placeholder=""
            />
            <InputComponent
              getValue={getValueRefs}
              id="Usuario"
              label="Usuario:"
              type="text"
              placeholder=""
            />
            <InputComponent
              getValue={getValueRefs}
              id="Contraseña"
              label="Contraseña:"
              type="text"
              placeholder=""
            />
          </div>
          <div className='row'>
            <InputComponent
                getValue={getValueRefs}
                id="Empresa"
                label="Empresa:"
                type="text"
                placeholder=""
              />
          </div>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleAdd}>Agregar</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
