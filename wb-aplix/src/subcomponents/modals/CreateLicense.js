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

export default function CreateLicense({ open, handleClose }) {
  const getValueRefs = useRef({});

  const handleAdd = async () => {

    const currentUser = sessionStorage.getItem('currentUser');

    const data = {
      User: currentUser,
      AmountUsers: getValueRefs.current["Usuario"].value,
      LicenseTime: getValueRefs.current["DuracionLicencia"].value,
      TimeOut: getValueRefs.current["TimeOutMensaje"].value,
      Company: getValueRefs.current["Compañia"].value
    };
    

    try {
      const response = await axios.post(env.API_URL+'AddLicense', data);
      console.log('response:', response);
      if (response.status === 200) {
        const statusMessage = response.data[0]['Resultado'];
        if (statusMessage === 'OK') {
          Swal.fire('Success', 'Licencia asignada', 'success').then(() => {
            window.location.reload();
          });
        } else {
          Swal.fire('Error', 'Hubo un problema al asignar la licencia (' + statusMessage + ')', 'error');
        }
      } else {
        Swal.fire('Error', 'Hubo un problema al asignar la licencia', 'error');
      }
      handleClose();
      window.location.href = '/license';
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
        <DialogTitle>{"Agregar Licencia a Usuario"}</DialogTitle>
        <DialogContent>
          <div className='row'>
            <InputComponent
              getValue={getValueRefs}
              id="Compañia"
              label="Compañia:"
              type="text"
              placeholder=""
            />
            <InputComponent
              getValue={getValueRefs}
              id="Usuario"
              label="Cantidad Usuarios:"
              type="number"
              placeholder=""
            />
            <InputComponent
              getValue={getValueRefs}
              id="DuracionLicencia"
              label="Duración(M):"
              type="number"
              placeholder=""
            />
          </div>
          <div className='row'>
            <InputComponent
                getValue={getValueRefs}
                id="TimeOutMensaje"
                label="TimeOut(Min):"
                type="number"
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
