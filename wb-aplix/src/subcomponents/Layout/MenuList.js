import { Menu } from "antd";
import {
  HomeOutlined,
  LogoutOutlined,
  WhatsAppOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const MenuList = ({ setOptionsVisibility }) => {
  const items = [
    {
      key: "Home",
      icon: <HomeOutlined />,
      label: (
        <Link to="/Home" onClick={() => setOptionsVisibility(true)}>
          Home
        </Link>
      )
    },
    {
      key: "WBMessage",
      icon: <WhatsAppOutlined />,
      label: (
        <Link to="/WBMessage" onClick={() => setOptionsVisibility(false)}>
          WBMessage
        </Link>
      )
    },
    {
      key: "LogOut",
      icon: <LogoutOutlined />,
      label: <Link to="/">Cerrar Sesión</Link>
    }
  ];

  return <Menu className="menu-bar" items={items} />;
};

export default MenuList;
