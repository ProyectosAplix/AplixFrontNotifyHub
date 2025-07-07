import { Menu } from "antd";
import { HomeOutlined,
        LogoutOutlined,
        CopyrightOutlined,
        WhatsAppOutlined 
} from "@ant-design/icons";
import { Link } from "react-router-dom"; 

const MenuSUList = ({ setOptionsVisibility  }) => {
    return (
        <Menu className="menu-bar">
            <Menu.Item key="Usuarios" icon={<HomeOutlined/>}>
                <Link to="/SUHome" onClick={() => { setOptionsVisibility(true); }}>Usuarios</Link> 
            </Menu.Item>

            <Menu.Item key="Licencia" icon={<CopyrightOutlined/>}>
                <Link to="/license" onClick={() => { setOptionsVisibility(false); }}>Licencias</Link> 
            </Menu.Item>

            <Menu.Item key="Roles" icon={<WhatsAppOutlined/>}>
                <Link to="/roles" onClick={() => { setOptionsVisibility(true); }}>Roles</Link> 
            </Menu.Item>

            <Menu.Item key="LogOut" icon={<LogoutOutlined />}>
                <Link to="/">Cerrar Sesión</Link> 
             </Menu.Item>
              
        </Menu>
    );
}

export default MenuSUList;