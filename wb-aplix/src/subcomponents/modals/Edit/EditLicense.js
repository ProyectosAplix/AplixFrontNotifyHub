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

export default function EditRolModal({ open, handleClose }) {
  const [ID, setID] = useState('');
  const [data, setData] = useState({});
  const [reset, setReset] = useState(false);
  const getValueRefs = useRef({});

  useEffect(() => {
    if (open) {
      const currentID = sessionStorage.getItem('currentLicense');
      setID(currentID);


      const fetchData = async () => {
        const data = {
          ID: currentID
        };
        try {
          const response = await axios.post(env.API_URL + 'GetEditLicense', data);
          const formattedData = response.data;
          setData(formattedData);
        } catch (error) {
          console.error("Error en traer la data de la licencia", error.message);
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
      ID: ID  ,
      AmountUsers: getValueRefs.current["Usuario"].value,
      LicenseTime: getValueRefs.current["Duración"].value,
      TimeOut: getValueRefs.current["TimeOut"].value
    };

  
    try {
      const response = await axios.post(env.API_URL + 'EditLicense', rawData);
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
        <DialogTitle>{`Edit ${ID}`}</DialogTitle>
        <DialogContent>
          <div className='row'>
            
            <InputEditComponent
              getValue={getValueRefs}
              id="Usuario"
              label="Cantidad Usuarios:"
              type="number"
              placeholder=""
              Avalue={data.CANTIDAD}
              reset={reset}
            />
            <InputEditComponent
              getValue={getValueRefs}
              id="Duración"
              label="Duración(M):"
              type="number"
              placeholder=""
              Avalue={data.DURACION}
              reset={reset}
            />
            <InputEditComponent
              getValue={getValueRefs}
              id="TimeOut"
              label="TimeOut(Min):"
              type="number"
              placeholder=""
              Avalue={data.TIMEOUT}
              reset={reset}
            />
          </div>
         
          

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleEdit}>Editar</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
