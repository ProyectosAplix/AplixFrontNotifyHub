
import { Routes,Route } from "react-router-dom";
import  LayoutP from "./components/layout";
import Home from "./pages/Admin/Home"; 
import WBMessage from "./pages/Admin/SendMessage";
import SUHome from "./pages/SUAdmin/SUHOME";
import Login from "./pages/Principal/Login";
import License from "./pages/SUAdmin/License";
import Roles from "./pages/SUAdmin/Roles";




function App() {
  return (
    <div >
      <Routes>
        <Route element={<LayoutP />} >
          <Route path="/home" element={<Home />} />
          <Route path="/WBMessage" element={<WBMessage />} />
          <Route path="/SUHome" element={<SUHome />} />
          <Route path="/license" element={<License />} />
          <Route path="/roles" element={<Roles />} />
        </Route>
        <Route path="/" element={<Login/>} />
        <Route path="/login" element={<Login/>} />    
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </div>
  );
}

export default App;