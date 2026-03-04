import {Route,Routes} from "react-router-dom"
import Login from "./pages/login.js"
import Register from "./pages/register.js";
import Home from "./pages/home.js"
import { Sidebar } from "./components/sidebar.js";
import { useState } from "react";
import { IcBaselineViewSidebar } from "./icons/sidebaricon.js";

function App() {
  const [bar, setBar] = useState(false)

  const handleSwitch = () => {
    setBar(prev => !prev); // toggle true/false
  };
  
  return (
    <div className="App">
        <Sidebar bar={bar} />
        <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
        <button className="switcher btn" onClick={handleSwitch}><IcBaselineViewSidebar /></button>
    </div>
     
  );
}

export default App;
