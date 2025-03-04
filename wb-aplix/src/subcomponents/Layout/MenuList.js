import { Menu } from "antd";
import { HomeOutlined,
        LogoutOutlined,
        WhatsAppOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom"; 

const MenuList = ({ setOptionsVisibility  }) => {
    return (
        <Menu className="menu-bar">
            <Menu.Item key="Home" icon={<HomeOutlined/>}>
                <Link to="/Home" onClick={() => { setOptionsVisibility(true); }}>Home</Link> 
            </Menu.Item>
            <Menu.Item key="WBMessage" icon={<WhatsAppOutlined/>}>
                <Link to="/WBMessage" onClick={() => { setOptionsVisibility(false); }}>WBMessage</Link>
            </Menu.Item>
            {/*}
            <Menu.Item key="Cliente" icon={<TeamOutlined />}>
            <Link to="/bienes" onClick={()=> {setOptionsVisibility(true); setAddPage('Cliente')}}>Cliente</Link> 
            </Menu.Item>
            <Menu.Item key="Busqueda" icon={<SearchOutlined />}>
                <Link to="/bienes" onClick={()=>setOptionsVisibility(false)}>Busqueda</Link> 
            </Menu.Item>
            */
            <Menu.Item key="LogOut" icon={<LogoutOutlined />}>
                <Link to="/">Cerrar Sesión</Link> 
             </Menu.Item>
             }   
        </Menu>
    );
}

export default MenuList;