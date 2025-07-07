import React, { useEffect, useState } from 'react';
import Table from '../../components/Table';
import BasicModal from '../../subcomponents/modals/CreateLicense';
import EditRolModal from '../../subcomponents/modals/Edit/EditRol';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { Button } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';
import env from '../../env-config'; // Importa las variables de entorno

const Title = "Roles";

const columns = [
  "ID",
  "Nombre", 
  "Tipo",
  "Descripción"
];

const Roles = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);



    //Funciones para manejar el modal de edicion
    const handleEditModalOpen = () => {
      if (selectedRows.length === 0) {
        return;
      }
  
      const selectedRol = data[selectedRows[0].dataIndex];
      const rolName = selectedRol[1];
      sessionStorage.setItem('currentRol', rolName);
  
      setEditModalOpen(true);
    };
  
    const handleEditModalClose = () => {
      setEditModalOpen(false);
    };

  // Cargar Datos
  useEffect(() => {
    sessionStorage.setItem('currentPage', 'Roles');
    const company = sessionStorage.getItem('compañia');
    if (!company) {
      // Redirigir al login si no hay compañía
      window.location.href = '/login';
      return;
    }
    const fetchData = async () => {
      try {
        const response = await axios.get(env.API_URL+'GetRoles?');
        const formattedData = response.data.map(Rol => [
          Rol.ID,
          Rol.NOMBRE,
          Rol.TIPO,
          Rol.DESCRIPCIÓN
          
        ]);
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data", error.message);
      }
    };

    fetchData();
  }, []);



  //Logica para eliminar
  const handleDelete = async () => {

    if (selectedRows.length === 0) {
      return;
    }

    const selectedRol = data[selectedRows[0].dataIndex];
    const id = selectedRol[0];

    try {
      const response = await axios.post(env.API_URL+'DeleteRol', 
        {
          ID: id
        }
      );
      if (response.status === 200) {
        Swal.fire('Success', 'Rol se ha eliminado exitosamente', 'success').then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire('Error', 'Hubo un problema al eliminar el Rol', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al eliminar el Rol', 'error');
    }
  };





  

  const customToolbarSelect = () => {
    return (
      <div>
        <Button type='text' className='toggle' icon={<EditFilled />}  onClick={handleEditModalOpen} title='Editar'/>
        <Button type='text' className='toggle' icon={<DeleteFilled />} onClick={handleDelete} />
      </div>
    );
  };

  return (
    <>
    <EditRolModal open={editModalOpen} handleClose={handleEditModalClose} />
      <BasicModal />
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

export default Roles;
