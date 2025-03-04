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
import { parsePhoneNumberFromString } from 'libphonenumber-js'; 

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditUserModal({ open, handleClose }) {
  const [number, setNumber] = useState('');
  const [data, setData] = useState({});
  const [companies, setCompanies] = useState([]);
  const [reset, setReset] = useState(false);
  const getValueRefs = useRef({});
  const [selectedCompany, setSelectedCompany] = useState('');

  useEffect(() => {
    if (open) {
      const Number = sessionStorage.getItem('Number');
      setNumber(Number);

      const fetchCompany = async () => {
        const data = {
          User: sessionStorage.getItem('loginUser')
        };
        try {
          const response = await axios.post(env.API_URL + 'GetCompaniesXUsers', data);
          setCompanies(response.data.map(company => company.Compañia)); 
          setSelectedCompany(response.data.length > 0 ? response.data[0].Compañia : '');
        } catch (error) {
          console.error('Error fetching companies:', error);
        }
      };
      fetchCompany();
    } else {
      // Reset the values when the modal is closed
      setReset(true);
      setTimeout(() => setReset(false), 0);
    }
  }, [open]);

  useEffect(() => {
    if (number) {
      const fetchData = async () =>{
        const data2 = { Number: number };
        try {
          const response = await axios.post(env.API_URL + 'GetUser', data2);
          setData(response.data);
        } catch (error) {
          console.error("Error en traer la data del usuario", error.message);
        }
      };
      fetchData();
    }
  }, [number]);

  // Phone number validation function
  const validatePhoneNumber = (phoneNumber) => {
    const phone = parsePhoneNumberFromString(phoneNumber);
    return phone && phone.isValid();
  };

  const handleEdit = async () => {
    const phoneValue = getValueRefs.current["Telefono"].value;

    const parserPhoneValue = "+" + phoneValue;


    // Validate the phone number
    if (!validatePhoneNumber(parserPhoneValue)) {
      Swal.fire('Error', 'El número de teléfono no es válido', 'error');
      handleClose();
      return;
    }



    const rawData = {
      Name: getValueRefs.current["Nombre"].value,
      SecondName: getValueRefs.current["Apellido"].value,
      Number: number,
      NewNumber: phoneValue,
      User: getValueRefs.current["Usuario"].value,
      Company: selectedCompany
    };

    try {
      const response = await axios.post(env.API_URL + 'EditUser', rawData);
      if (response.status === 200) {
        Swal.fire('Success', 'Usuario se ha editado exitosamente', 'success').then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire('Error', 'Hubo un problema al editar el usuario', 'error');
      }
      handleClose();
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al establecer la conexión', 'error');
      handleClose();
    }
  };

  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
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
        <DialogTitle>{`Editar a ${data.Nombre}`}</DialogTitle>
        <DialogContent>
          <div className='row'>
            <InputEditComponent
              getValue={getValueRefs}
              id="Nombre"
              label="Nombre:"
              type="text"
              placeholder=""
              Avalue={data.Nombre}
              reset={reset}
            />
            <InputEditComponent
              getValue={getValueRefs}
              id="Apellido"
              label="Apellido:"
              type="text"
              placeholder=""
              Avalue={data.PrimerApellido}
              reset={reset}
            />
            <InputEditComponent
              getValue={getValueRefs}
              id="Telefono"
              label="Telefono:"
              type="number"
              placeholder=""
              Avalue={number}
              reset={reset}
            />
          </div>
          <div className='row'>

          <InputEditComponent
              getValue={getValueRefs}
              id="Usuario"
              label="Usuario:"
              type="text"
              placeholder=""
              Avalue={data.Usuario}
              reset={reset}
            />
            <div className="col-md-4 col-sm-4">
              <label htmlFor='Compañia' className="form-label"> Compañia</label>
              <select
                className="form-select"
                id='Compañia'
                value={selectedCompany}
                onChange={handleCompanyChange}
              >
                {companies.length > 0 && (
                  <>
                    <option value={data.Compañia}>{data.Compañia}</option>
                    {companies.slice(1).map((company, index) => (
                      <option key={index + 1} value={company}>{company}</option>
                    ))}
                  </>
                )}
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
