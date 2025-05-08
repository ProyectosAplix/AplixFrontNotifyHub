import React, { useEffect, useState } from 'react';
import Table from '../../components/Table';
import EditUser from '../../subcomponents/modals/Edit/EditUser'
import CreateRolxUser from '../../subcomponents/modals/CreateUserxRol';
import { DeleteFilled, EditFilled ,CloudSyncOutlined,ContactsOutlined } from '@ant-design/icons';
import { Button, Checkbox } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';
import env from '../../env-config'; // Importa las variables de entorno

let Title = "Gestión de Usuarios Finales";

const columns = [
  "Linea",
  "Nombre",
  "Apellido",
  "Numero",
  "Usuario",
  "Rol",
  "Compañia",
  "Activo"
];

const Home = () => {
  const [data, setData] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [rolModalOpen, setRolModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);


  // Cargar Datos
  useEffect(() => {
    const company = sessionStorage.getItem('compañia');
    const user = sessionStorage.getItem('loginUser');
    if (!company) {
      // Redirigir al login si no hay compañía
      window.location.href = '/login';
      return;
    }
    
    const fetchData = async () => {
      const  data = {
        User: user
      }

      try {
        const response = await axios.post(env.API_URL+'GetUsers?', data);
        const formattedData = response.data.map((user, index) => [
          index + 1,
          user.Nombre,
          user.PrimerApellido,
          user.NumeroTelefono,
          user.Usuario,
          user.Rol,
          user.Compañia,
          <Checkbox defaultChecked={user.Activo} disabled />
        ]);
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data", error.message);
      }
    };

    fetchData();
  }, []);



  // Lógica para eliminar 
  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      return;
    }
  
    // Preguntar al usuario si está seguro de eliminar
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto. ¿Quieres eliminar estos usuarios?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const deletePromises = selectedRows.map(async (row) => {
            const selectedUser = data[row.dataIndex];
            const phoneNumber = selectedUser[3];
  
            return await axios.post(env.API_URL + 'DeleteUsers', {
              Number: phoneNumber
            });
          });
  
          // Espera a que todas las promesas de eliminación se completen
          const responses = await Promise.all(deletePromises);
  
          // Verificar si todas las respuestas fueron exitosas
          const allSuccessful = responses.every(response => response.status === 200);
  
          if (allSuccessful) {
            Swal.fire('Éxito', 'Los usuarios se han eliminado exitosamente', 'success').then(() => {
              window.location.reload();
            });
          } else {
            Swal.fire('Error', 'Hubo un problema al eliminar algunos clientes', 'error');
          }
        } catch (error) {
          Swal.fire('Error', 'Hubo un problema al eliminar los clientes', 'error');
        }
      }
    });
  };
  




    //Logica para Editar
    const handleEditModalOpen = async () => {

      if (selectedRows.length === 0) {
        return;
      }

      if(selectedRows.length > 1){
        Swal.fire('Error', 'Solo puede seleccionar un usuario', 'error');
        return;
      }
  
      const selectedUser = data[selectedRows[0].dataIndex];
      const phoneNumber = selectedUser[3];
      sessionStorage.setItem('Number',phoneNumber);

      setEditModalOpen(true);
      
    };
    const handleEditModalClose = () => {
      setEditModalOpen(false);
    };
  

    const handleRolModalOpen = async () => {
      if (selectedRows.length === 0) {
        return;
      }
      if(selectedRows.length > 1){
        Swal.fire('Error', 'Solo puede seleccionar un usuario', 'error');
        return;
      }

      const selectedUser = data[selectedRows[0].dataIndex];
      const phoneNumber = selectedUser[3];
      const company = selectedUser[6];
      sessionStorage.setItem('Number',phoneNumber);
      sessionStorage.setItem('Company',company);

      

      setRolModalOpen(true);

    };

    const handleRolModalClose = () => {
      setRolModalOpen(false);
    }
    




  //logica para Estado
  const handleUpdateStatus = async () => {
    if (selectedRows.length === 0) {
      return;
    }
  
    const requests = [];
    // eslint-disable-next-line
    let hasInvalidUser = false;
  
    // Generar las solicitudes y validar usuarios sin rol
    for (const row of selectedRows) {
      const selectedUser = data[row.dataIndex];
      const phoneNumber = selectedUser[3];
      const role = selectedUser[5]; // Obtener el rol del usuario
      const company = selectedUser[6];
      const isChecked = selectedUser[7].props;
      const newStatus = !isChecked.defaultChecked;
  
      if (!role || role.trim() === "") {
        // Mostrar mensaje de error solo para el usuario específico
        // eslint-disable-next-line
        hasInvalidUser = true;
        await Swal.fire('Advertencia', `Por favor asigne un rol al usuario con teléfono ${phoneNumber} antes de activarlo/desactivarlo.`, 'warning');
        // Esperar a que el usuario confirme la advertencia antes de continuar
      } else {
        requests.push({
          Number: phoneNumber,
          State: newStatus,
          Company: company,
        });
      }
    }
  
    // Si no hay solicitudes válidas, salir de la función
    if (requests.length === 0) {
      return;
    }
  
    let successCount = 0;
    let errorCount = 0;
  
    try {
      // Enviar las solicitudes una por una en orden secuencial
      for (const user of requests) {
        try {
          const response = await axios.post(`${env.API_URL}UpdateUsers?`, user);
          if (response.status === 200) {
            const result = response.data[0].Resultado;
            if (result === "OK") {
              successCount++;
            } else {
              errorCount++;
            }
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }
  
      // Mostrar mensaje global basado en los resultados
      if (successCount === requests.length) {
        await Swal.fire('Éxito', 'Todos los clientes válidos se han activado/desactivado exitosamente', 'success').then(() => {
          window.location.reload(); // Recargar la página después de que el usuario haga clic en "OK"
        });
      } else {
        await Swal.fire('Error', `${errorCount} clientes no se pudieron activar/desactivar`, 'error').then(() => {
          window.location.reload(); // Recargar la página después de que el usuario haga clic en "OK");
        });
      }
  
    } catch (error) {
      await Swal.fire('Error', 'Hubo un problema al establecer la conexión', 'error');
    }
  };
  
  



  const customToolbarSelect = () => {
    return (
      <div>
        <Button type='text' className='toggle' icon={<CloudSyncOutlined />}  onClick={handleUpdateStatus} title='Activo\Inactivo'/>
        <Button type='text' className='toggle' icon={<ContactsOutlined />}  onClick={handleRolModalOpen} title='Asignar Rol'/>
        <Button type='text' className='toggle' icon={<EditFilled />}  onClick={handleEditModalOpen} title='Editar'/>
        <Button type='text' className='toggle' icon={<DeleteFilled />} onClick={handleDelete} title='Eliminar'/>
      </div>
    );
  };

  return (
    <>
      <CreateRolxUser open={rolModalOpen}  handleClose={handleRolModalClose} />
      <EditUser open={editModalOpen} handleClose={handleEditModalClose} />
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
