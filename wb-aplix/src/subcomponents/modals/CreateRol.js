import React, { useRef, useState } from 'react';
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

export default function CreateRol({ open, handleClose }) {
  const getValueRefs = useRef({});
  const [selectedAction, setSelectedAction] = useState('Acción'); // Estado para el valor seleccionado

  const handleAdd = async () => {
    const data = {
      Name: getValueRefs.current["Nombre"].value,
      Description: getValueRefs.current["Descripcion"].value,
      ActionType: selectedAction 
    };

    

    try {
      const response = await axios.post(env.API_URL + 'AddRol', data);
      if (response.status === 200) {
        Swal.fire('Success', 'Se ha creado el rol', 'success').then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire('Error', 'Hubo un problema al crear el rol', 'error');
      }
      handleClose();
      window.location.href = '/roles';
    } catch (error) {
      console.log('error:', error.message);
      Swal.fire('Error', 'Hubo un problema al establecer la conexión', 'error');
      handleClose();
    }
      
  };

  const handleActionChange = (event) => {
    setSelectedAction(event.target.value); // Actualizar el estado con el valor seleccionado
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
        <DialogTitle>{"Agregar Roles"}</DialogTitle>
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
              id="Descripcion"
              label="Descripcion:"
              type="text"
              placeholder=""
            />

            <div className="col-md-4 col-sm-4">
              <label htmlFor='ActionType' className="form-label"> Tipo de Acción: </label>
              <select
                className="form-select"
                id='ActionType'
                value={selectedAction}
                onChange={handleActionChange}
              >
                <option value="Accion">Acción</option>
                <option value="Consulta">Consulta</option>
              </select>
            </div>
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