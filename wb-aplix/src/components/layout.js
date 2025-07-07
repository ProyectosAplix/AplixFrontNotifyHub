import  { useState } from 'react';
import '../css/Layout.css';
import {Button, Layout} from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined,PlusOutlined } from '@ant-design/icons';
import Logo from '../subcomponents/Layout/Logo';
import MenuList from '../subcomponents/Layout/MenuList';
import MenuSUList from '../subcomponents/Layout/MenuSUList';
import { Outlet } from 'react-router-dom';
import AlertDialogSlide  from '../subcomponents/modals/CreateUser';
import CreateAdministratorUser from '../subcomponents/modals/CreateUserAdmin';
import CreateRol from '../subcomponents/modals/CreateRol';

 
const { Header, Sider } = Layout;

function LayoutP()  {
  /*
  * 1. Crear un estado para el colapso del sidebar
  * 2. Crear un estado para la visibilidad de las opciones
  * 3. Crear un estado para la visibilidad del modal
  * 4. Crear un estado para saber cual pagina se va a agregar
  */
  const [Collapsed, setCollapsed] = useState(true);
  const [optionVisibility, setOptionVisibility] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);


  /*
  *Función para manejar el cambio de visibilidad de las opciones
  */
  const handleOptionVisibilityChange = (newState) => {
    setOptionVisibility(newState);
  }

  /*
  *Funciones para manejar el cambio de visibilidad del modal
  */
  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  /*
  *Función para manejar la página que se va a agregar
  */

  const determineComponent = () => {
    const currentPage = sessionStorage.getItem('currentPage');
    const company = sessionStorage.getItem('compañia');
    console.log(currentPage);
    
    if (currentPage === 'suhome' && company === 'aplix') {
      return <CreateAdministratorUser open={modalOpen} handleClose={handleModalClose} />;
    } else if (currentPage === 'Roles') {
      return <CreateRol open={modalOpen} handleClose={handleModalClose} />;
    } else if(currentPage === 'license'){ 
      return null;
    }
    else{
      return <AlertDialogSlide open={modalOpen} handleClose={handleModalClose} />;
    }
  };

  return (
    
        <Layout >
            <Sider collapsed={Collapsed} theme='light' className="sidebar"> 
            <Logo /> 
            {sessionStorage.getItem('compañia') === 'aplix' ?
              <MenuSUList setOptionsVisibility={handleOptionVisibilityChange} />:
              <MenuList setOptionsVisibility={handleOptionVisibilityChange} />
              
            }
            </Sider>
            <Layout className='layout-body'>
                <Header className='layout-header'>
                  <Button 
                  type='text' 
                  className='toggle'
                  onClick={() => setCollapsed(!Collapsed)}
                  icon={Collapsed ?
                    <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                  />
                  {optionVisibility && ( <div>
                    <Button type='text' className='toggle' icon={<PlusOutlined />} onClick={handleModalOpen} />
                    
                  </div>
                  )}
                </Header>
                <Outlet className='layout-page' /> {/* Esto renderiza las sub-rutas*/}
            </Layout>
            {determineComponent()}
        </Layout>

  );
};
export default LayoutP;