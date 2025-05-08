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
  const [rol, setRol] = useState('');
  const [data, setData] = useState({});
  const [reset, setReset] = useState(false);
  const [selectedAction, setSelectedAction] = useState('Accion'); // Estado para el valor seleccionado
  const getValueRefs = useRef({});

  useEffect(() => {
    if (open) {
      const currenRol = sessionStorage.getItem('currentRol');
      setRol(currenRol);

      const fetchData = async () => {
        const data = {
          Rol: currenRol
        };
        try {
          const response = await axios.post(env.API_URL + 'GetRol', data);
          const formattedData = response.data;
          setData(formattedData);
          // Cargar el valor de data.TIPO en el estado selectedAction
          if (formattedData.TIPO) {
            setSelectedAction(formattedData.TIPO);
          }
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
      ID: data["ID"],
      Name: getValueRefs.current["Nombre"].value,
      Description: getValueRefs.current["Descripcion"].value,
      ActionType: selectedAction 
    };
    

    
    try {
      const response = await axios.post(env.API_URL + 'EditRol', rawData);

      if (response.status === 200) {
        Swal.fire('Success', 'Rol se ha editado exitosamente', 'success').then(() => {
          window.location.reload();
        });
      } else {
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
        <DialogTitle>{`Edit ${rol}`}</DialogTitle>
        <DialogContent>
          <div className='row'>
            <InputEditComponent
              getValue={getValueRefs}
              id="Nombre"
              label="Nombre:"
              type="text"
              placeholder=""
              Avalue={rol}
              reset={reset}
            />
            <InputEditComponent
              getValue={getValueRefs}
              id="Descripcion"
              label="Descripcion:"
              type="text"
              placeholder=""
              Avalue={data.DESCRIPCIÓN}
              reset={reset}
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
          <Button onClick={handleEdit}>Editar</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}