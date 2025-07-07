import React, { useRef, useState, useEffect } from 'react';
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
import { parsePhoneNumberFromString } from 'libphonenumber-js'; 

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({ open, handleClose }) {
  const getValueRefs = useRef({});
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');

  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, []);


  // Phone number validation function
  const validatePhoneNumber = (phoneNumber) => {
    const phone = parsePhoneNumberFromString(phoneNumber);
    return phone && phone.isValid();
  };

  const handleAdd = async () => {

    const phoneValue = getValueRefs.current["Telefono"].value;

    const parserPhoneValue = "+" + phoneValue;


    // Validate the phone number
    if (!validatePhoneNumber(parserPhoneValue)) {
      Swal.fire('Error', 'El número de teléfono no es válido', 'error');
      handleClose();
      return;
    }

    const data = {
      Name: getValueRefs.current["Nombre"].value,
      SurName: getValueRefs.current["PrimerApellido"].value,
      SecondSurname: getValueRefs.current["SegundoApellido"].value,
      Number: phoneValue,
      User: getValueRefs.current["Usuario"].value,
      Company: selectedCompany
    };


    try {
      const response = await axios.post(env.API_URL + 'AddUsers', data);
      if (response.status === 200) {
        const result = response.data[0].Result;
        if (result === 'OK') {
          Swal.fire('Success', 'Usuario agregado exitosamente', 'success').then(() => {
            window.location.reload();
          });
        } else if (result === 'Error: Número de teléfono ya registrado.') {
          Swal.fire('Error', 'El número de teléfono ya está registrado', 'error');
        } else {
          Swal.fire('Error', 'Hubo un problema al agregar el usuario', 'error');
        }
      } else {
        Swal.fire('Error', 'Hubo un problema al agregar el usuario', 'error');
      }
      handleClose();
    } catch (error) {
      console.log('Error:', error.message);
      Swal.fire('Error', 'Hubo un problema al agregar el usuario', 'error');
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
        <DialogTitle>{"Agregar Cliente"}</DialogTitle>
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
              id="PrimerApellido"
              label="PrimerApellido:"
              type="text"
              placeholder=""
            />
            <InputComponent
              getValue={getValueRefs}
              id="SegundoApellido"
              label="SegundoApellido:"
              type="text"
              placeholder=""
            />
          </div>

          <div className='row'>
          <InputComponent
              getValue={getValueRefs}
              id="Usuario"
              label="Usuario:"
              type="text"
              placeholder=""
            />
            <InputComponent
              getValue={getValueRefs}
              id="Telefono"
              label="Telefono:"
              type="number"
              placeholder="506********"
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
                    <option value={companies[0]}>{companies[0]}</option>
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
          <Button onClick={handleAdd}>Agregar</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
