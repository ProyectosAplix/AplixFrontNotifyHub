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
import Checkbox from '@mui/material/Checkbox';




import 'bootstrap/dist/css/bootstrap.min.css';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ModalUserXRol({ open, handleClose }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [Roles, setRoles] = useState([]);
  const  [RolesSelected, setRolesSelected] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      const number = sessionStorage.getItem('Number');
      setPhoneNumber(number);

      const data = {
        User: sessionStorage.getItem('loginUser'),
        Company: sessionStorage.getItem('Company'),
        PhoneNumber: number
      };


      const data2 = {
        NUMBER: number
      };
      try {
        const response = await axios.post(env.API_URL + 'GetRolesxUser', data);

        setRoles(response.data.map(rol => rol.Nombre)); 


        
        const response2 = await axios.post(env.API_URL + 'GetUserRol', data2);
        setRolesSelected(response2.data.map(rol => rol.NOMBRE));

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
      Roles: RolesSelected ,
      PhoneNumber: phoneNumber
    };

    console.log('Data to send:', data);

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



  const handleCheckboxChange = (event) => {
    const role = event.target.name;
    if (event.target.checked) {
      setRolesSelected((prev) => [...prev, role]);
    } else {
      setRolesSelected((prev) => prev.filter((r) => r !== role));
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
        <DialogTitle>{`Agregar Rol al # ${phoneNumber}`}</DialogTitle>
        <DialogContent>
          <div className='row'>
            <div className="col-md-12 col-sm-12">
              <label className="form-label">Selecciona los roles para el usuario:</label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)', // Ajusta a 4 si quieres más columnas
                  gap: '10px',
                  paddingTop: '10px'
                }}
              >
                {Roles.map((role, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                      checked={RolesSelected.includes(role)}
                      onChange={handleCheckboxChange}
                      name={role}
                      size="small"
                    />
                    <label htmlFor={role} style={{ marginLeft: '5px' }}>{role}</label>
                  </div>
                ))}
              </div>
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