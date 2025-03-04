import React, { useEffect, useState } from 'react';
import Table from '../../components/Table';
import LicenseModal from '../../subcomponents/modals/CreateLicense';
import EditUserModal from '../../subcomponents/modals/Edit/EditUserAdmin';
import { DeleteFilled, EditFilled,CopyrightOutlined,CloudSyncOutlined, DesktopOutlined  } from '@ant-design/icons';
import { Button, Checkbox } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';
import env from '../../env-config'; 

const Title = "Gestión de Usuarios Administradores";

const columns = [
  "Nombre",
  "Usuario", 
  "Empresa",
  "Activo",
  "INSToken"
];

const Home = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  //Funciones para manejar el modal de licencias
  const handleModalOpen = () => {
    if (selectedRows.length === 0) {
      return;
    }

    if(selectedRows.length > 1){
      Swal.fire('Error', 'Solo puede seleccionar un usuario', 'error');
      return;
    }

    const selectedUser = data[selectedRows[0].dataIndex];
    const NickUser = selectedUser[1];
    sessionStorage.setItem('currentUser', NickUser);

    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  //Funciones para manejar el modal de edicion
  const handleEditModalOpen = () => {
    if (selectedRows.length === 0) {
      return;
    }
    if(selectedRows.length > 1){
      Swal.fire('Error', 'Solo puede seleccionar un usuario', 'error');
      return;
    }

    const selectedUser = data[selectedRows[0].dataIndex];
    const NickUser = selectedUser[1];
    sessionStorage.setItem('currentUser', NickUser);

    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };


  const handleToken = async () => {
    if (selectedRows.length === 0) {
      return;
    }

    if(selectedRows.length > 1){
      Swal.fire('Error', 'Solo puede seleccionar un usuario', 'error');
      return;
    }

    const selectedUser = data[selectedRows[0].dataIndex];
    const NickUser = selectedUser[1];
    
    try {
      const response = await axios.post(env.API_URL+'AddINSToken', 
        {
          USER: NickUser
        }
      );
      if (response.status === 200) {

        if(response.data === 'El Usuario ya tiene un TOKEN asignado.'){
          Swal.fire('Error', 'Ya tiene un token asignado', 'error');
        }
        else{
          Swal.fire('Success', 'Se le ha asignado un token de instalación', 'success').then(() => {
            window.location.reload();
          });
        }
               
      } else {
        Swal.fire('Error', 'Hubo un problema al asignar un token de instalación', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al asignar un token de instalación', 'error');
    }
  };



  // Cargar Datos
  useEffect(() => {
    sessionStorage.setItem('currentPage', 'suhome');
    const company = sessionStorage.getItem('compañia');
    if (!company) {
      // Redirigir al login si no hay compañía
      window.location.href = '/login';
      return;
    }
    const fetchData = async () => {
      try {
        const response = await axios.get(env.API_URL+'GetAdministratorUsers?');
        const formattedData = response.data.map(user => [
          user.NOMBRE,
          user.USUARIO,
          user.EMPRESA,
          <Checkbox defaultChecked={user.ACTIVO} disabled />,
          user.TOKEN 
        ]);
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data", error.message);
      }
    };

    fetchData();
  }, []);



  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      Swal.fire('Advertencia', 'No se ha seleccionado ningún cliente', 'warning');
      return;
    }
  
    // Extraer nicknames de las filas seleccionadas
    const nicknames = selectedRows.map(row => data[row.dataIndex][1]);
  
    // Lista para almacenar los usuarios que fallaron
    const failedUsers = [];
  
    try {
      // Iterar sobre cada nickname y realizar una solicitud por separado
      for (const nickname of nicknames) {
        console.log(`Eliminando cliente: ${nickname}`);
        try {
          const response = await axios.post(env.API_URL + 'DeleteAdministratorUsers', 
            {
              User: nickname // Enviar un solo usuario a la vez
            }
          );
  
          // Verificar la respuesta

  
          if (response.status !== 200) {

            failedUsers.push(nickname);
          } 
        } catch (error) {

          failedUsers.push(nickname);
        }
      }
  
      // Verificar si hubo errores
      if (failedUsers.length > 0) {
        console.log(`Clientes que fallaron: ${failedUsers.join(', ')}`);
        Swal.fire('Error', `Hubo un problema al eliminar los siguientes clientes: ${failedUsers.join(', ')}`, 'error');
      } else {
        console.log('Todos los clientes se eliminaron exitosamente');
        Swal.fire('Éxito', 'Clientes eliminados exitosamente', 'success').then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.error('Error inesperado al eliminar los clientes:', error);
      Swal.fire('Error', 'Hubo un problema inesperado al eliminar los clientes', 'error');
    }
  };
  
  


  //logica para Estado
  const handleUpdateStatus = async () => {
    if (selectedRows.length === 0) {
      return;
    }
  
    // Crear un arreglo para almacenar las promesas de actualización
    const updatePromises = selectedRows.map(rowIndex => {
      const selectedUser = data[rowIndex.dataIndex]; // Acceder a la fila seleccionada
      const NickUser = selectedUser[1]; // Asumiendo que el nombre de usuario está en el índice 1
      const isChecked = selectedUser[3].props; // Acceder al estado del checkbox
      const newStatus = !isChecked.defaultChecked; // Cambiar el estado
  
      return axios.post(`${env.API_URL}UpdateStateAdministratorUsers?`, {
        User: NickUser,
        State: newStatus
      });
    });
  
    try {
      // Esperar que todas las promesas se resuelvan
      const responses = await Promise.all(updatePromises);
  
      // Verificar si todas las respuestas son exitosas
      const allSuccessful = responses.every(response => response.status === 200);
  
      if (allSuccessful) {
        Swal.fire('Success', 'Clientes se han actualizado exitosamente', 'success').then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire('Error', 'Hubo un problema al actualizar uno o más clientes', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al actualizar los clientes', 'error');
    }
  };

  const customToolbarSelect = () => {


    return (
      <div>
        <Button type='text' className='toggle' icon={<CopyrightOutlined />}  onClick={handleModalOpen}  title='Asignar Licencia'/>
        <Button type='text' className='toggle' icon={<CloudSyncOutlined />}  onClick={handleUpdateStatus} title='Activo\Inactivo'/>
        <Button type='text' className='toggle' icon={<DesktopOutlined />}  onClick={handleToken} title='INSToken'/>
        <Button type='text' className='toggle' icon={<EditFilled />}  onClick={handleEditModalOpen} title='Editar'/>
        <Button type='text' className='toggle' icon={<DeleteFilled />} onClick={handleDelete} title='Eliminar'/>
      </div>
    );
  };

  return (
    <>
      <EditUserModal open={editModalOpen} handleClose={handleEditModalClose} />
      <LicenseModal open={modalOpen} handleClose={handleModalClose} />
      <Table
        title={Title}
        data={data}
        columns={columns}
        customToolbarSelectFunction={customToolbarSelect}
        setSelectedRows={setSelectedRows}
        setSelectableRows={"multiple"}
      />
    </>
  );
}

export default Home;
