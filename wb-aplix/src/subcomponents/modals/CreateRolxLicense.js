import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import env from '../../env-config';
import 'bootstrap/dist/css/bootstrap.min.css';
import DragDrop from '../../components/DragDrop';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreateRolxLicense({ open, handleClose }) {
  const [AsignadosItems, setAsignadosItems] = useState([]);
  const [ID, setID] = useState(0);
  const [initialItems, setInitialItems] = useState({
    root: [],
    Asignados: []
  });
  const [loading, setLoading] = useState(true);
  const [dataReady, setDataReady] = useState(false);

  const fetchInitialItems = useCallback(async (licenseID) => {
    const data = { ID: licenseID };

    setLoading(true);

    try {
      const response = await axios.post(env.API_URL + 'GetRolesXLicense', data);
      if (response.status === 200) {
        const [data1, data2] = response.data;

        const rootItems = data1.map(role => role.NOMBRE);
        const asignadosItems = data2.map(role => role.NOMBRE);

        setInitialItems({
          root: rootItems || [],
          Asignados: asignadosItems || []
        });
        setDataReady(true);
      } else {
        Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
      }
    } catch (error) {
      console.log('error:', error.message);
      Swal.fire('Error', 'Hubo un problema al cargar los datos', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      const currentID = sessionStorage.getItem('currentLicense');
      setID(currentID);
      fetchInitialItems(currentID);
    } else {
      setDataReady(false); // Resetea el estado cuando el modal se cierra
    }
  }, [open, fetchInitialItems]);

  const handleAdd = async () => {

    const data = {
      License: ID,
      Roles:  AsignadosItems.length > 0 ? AsignadosItems.join(",") : ""
    };

    try {
      const response = await axios.post(env.API_URL + 'AddRolesXLicense', data);
      if (response.status === 200) {
        if (response.data[0].Resultado === "OK") {
          Swal.fire('Success', 'Se han agregado los roles a la licencia', 'success').then(() => {
            
          });
        } else {
          Swal.fire('Error', 'Hubo un problema al agregar los roles a la licencia (' + response.data[0].Resultado + ')', 'error');
        }
      } else {
        Swal.fire('Error', 'Hubo un problema al agregar los roles a la licencia', 'error');
      }
    } catch (error) {
      console.log('error:', error.message);
      Swal.fire('Error', 'Hubo un problema al establecer la conexión', 'error');
    } finally {
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
        <DialogTitle>{`Agregar Roles a la licencia ${ID}`}</DialogTitle>
        <DialogContent>
          {loading ? (
            <p>Cargando...</p>
          ) : (
            dataReady && (
              <DragDrop 
                initialItems={initialItems}
                onItemsChange={setAsignadosItems} 
              />
            )
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleAdd}>Actualizar</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
