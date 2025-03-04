import React, {  useState, useEffect } from 'react';
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ModalUserXRol({ open, handleClose }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [Roles, setRoles] = useState([]);
  const [selectedRol, setselectedRol] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const number = sessionStorage.getItem('Number');
      setPhoneNumber(number);

      const data = {
        User: sessionStorage.getItem('loginUser'),
        Company: sessionStorage.getItem('Company'),
        PhoneNumber: number
      };
      try {
        const response = await axios.post(env.API_URL + 'GetRolesxUser', data);
        
        setRoles(response.data.map(rol => rol.Nombre)); 

        setselectedRol(response.data.length > 0 ? response.data[0].Nombre : '');
        
      } catch (error) {
        console.error('Error fetching Roles:', error);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  const handleAdd = async () => {
    const data = {
      Rol: selectedRol,
      PhoneNumber: phoneNumber
    };


    try {
      const response = await axios.post(env.API_URL + 'AddRolesXUser', data);
      if (response.status === 200) {
        const result = response.data[0].Resultado;
        if (result === 'OK') {
          Swal.fire('Success', 'Rol agregado exitosamente', 'success').then(() => {
            window.location.reload();
          });
        }  else {
          Swal.fire('Error', 'Hubo un problema al agregar el rol', 'error');
        }
      } else {
        Swal.fire('Error', 'Hubo un problema al agregar el rol', 'error');
      }
      handleClose();
    } catch (error) {
      console.log('Error:', error.message);
      Swal.fire('Error', 'Hubo un problema al agregar el usuario', 'error');
      handleClose();
    }
  };

  const handleCompanyChange = (event) => {
    setselectedRol(event.target.value);
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
        <DialogTitle>{`Agregar Rol al # ${phoneNumber}`}</DialogTitle>
        <DialogContent>
          <div className='row'>
            <div className="col-md-6 col-sm-6">
              <label htmlFor='Rol' className="form-label"> Rol: </label>
              <select
                className="form-select"
                id='Rol'
                value={selectedRol}
                onChange={handleCompanyChange}
              >
                {Roles.length > 0 && (
                  <>
                    <option value={Roles[0]}>{Roles[0]}</option>
                    {Roles.slice(1).map((nombre, index) => (
                      <option key={index + 1} value={nombre}>{nombre}</option>
                    ))}
                  </>
                )}
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