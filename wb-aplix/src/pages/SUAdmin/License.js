import React, { useEffect, useState } from 'react';
import Table from '../../components/Table';
import { DeleteFilled, EditFilled,ApiFilled, SafetyCertificateFilled  } from '@ant-design/icons';
import { Button } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';
import env from '../../env-config'; // Importa las variables de entorno
import ModalRolxLicense from '../../subcomponents/modals/CreateRolxLicense';
import EditLicenseModal from '../../subcomponents/modals/Edit/EditLicense';

const Title = "Licencias";

const columns = [
  "ID",
  "Nombre",
  "Usuario", 
  "Compañia",
  "Cantidad Usuarios",
  "Estado",
  "Duración",
  "Ultimo Pago",
  "Tiempo de Espera"
];

const License = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);


    //Funciones para manejar el modal de licencias
    const handleModalOpen = () => {
      if (selectedRows.length === 0) {
        return;
      }
  
      const selectedUser = data[selectedRows[0].dataIndex];

      const IDicense = selectedUser[0];
      sessionStorage.setItem('currentLicense', IDicense);
  
      setModalOpen(true);
    };


    const handleModalClose = () => {
      setModalOpen(false);
    };
  


  // Cargar Datos
  useEffect(() => {
    sessionStorage.setItem('currentPage', 'license');
    const company = sessionStorage.getItem('compañia');
    if (!company) {
      // Redirigir al login si no hay compañía
      window.location.href = '/login';
      return;
    }
    const fetchData = async () => {
      try {
        const response = await axios.get(env.API_URL+'GetLicense?');
        console.log(response.data);
        const formattedData = response.data.map(License => [
          License.ID,
          License.Nombre,
          License.Usuario,
          License.Compañia,
          License.Cantidad,
          License.Estado,
          License.Duración,
          License.FechaActual,
          License.TiempoEspera
          
        ]);
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data", error.message);
      }
    };

    fetchData();
  }, []);


  //Funciones para manejar el modal de edicion
  const handleEditModalOpen = () => {
    if (selectedRows.length === 0) {
      return;
    }

    const selectedUser = data[selectedRows[0].dataIndex];

    const IDicense = selectedUser[0];
    sessionStorage.setItem('currentLicense', IDicense);

    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };


  //Logica para eliminar
  const handleDelete = async () => {

    if (selectedRows.length === 0) {
      return;
    }

    const selectedUser = data[selectedRows[0].dataIndex];
    const IDLicense = selectedUser[0];

    try {
      const response = await axios.post(env.API_URL+'DeleteLicense', 
        {
          ID: IDLicense
        }
      );
      if (response.status === 200) {
        Swal.fire('Success', 'Licencia se ha eliminado exitosamente', 'success').then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire('Error', 'Hubo un problema al eliminar la licencia', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al eliminar la licencia', 'error');
    }
  };


  //logica de pago de licencia
  const handlePay = async () => {

    if (selectedRows.length === 0) {
      return;
    }

    const selectedUser = data[selectedRows[0].dataIndex];
    const IDLicense = selectedUser[0];

    try {
      const response = await axios.post(env.API_URL+'PayLicense', 
        {
          ID: IDLicense
        }
      );
      if (response.status === 200 && response.data[0]['Mensaje'] === 'OK') {
        Swal.fire('Success', 'Licencia se ha pagado exitosamente', 'success').then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire('Error', 'Hubo un problema al pagar la licencia', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al pagar la licencia', 'error');
    }
  };


  const customToolbarSelect = () => {
    return (
      <div>
        
        <Button type='text' className='toggle' icon={<SafetyCertificateFilled />}  onClick={handlePay}  title='Asignar Pago'/>
        <Button type='text' className='toggle' icon={<ApiFilled />}  onClick={handleModalOpen}  title='Asignar Roles'/>
        <Button type='text' className='toggle' icon={<EditFilled />}  onClick={handleEditModalOpen}/>
        <Button type='text' className='toggle' icon={<DeleteFilled />} onClick={handleDelete} />
      </div>
    );
  };

  return (
    <>
      <EditLicenseModal open={editModalOpen} handleClose={handleEditModalClose} />
      <ModalRolxLicense open={modalOpen} handleClose={handleModalClose} />
      <Table
        title={Title}
        data={data}
        columns={columns}
        customToolbarSelectFunction={customToolbarSelect}
        setSelectedRows={setSelectedRows}
        setSelectableRows={"single"}
      />
    </>
  );
}

export default License;
