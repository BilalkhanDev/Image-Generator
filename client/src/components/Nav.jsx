import { Link, NavLink, useNavigate } from "react-router-dom";
import { logo } from "../assets";
const Nav=({setAuthenticated})=>{
  const navigate=useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    setAuthenticated(false)
     navigate('/');
    }
  
 return (<>
    <header className="w-full flex justify-between items-center bg-[#2e2e2e] sm:px-8 px-4 py-4 border-b border-[#323131]">
      <Link to="/home">
        <img src={logo} alt="logo" className="w-44 object-contain" />
      </Link>
      <div className="flex items-center">
        <Link
          to="/mycollection"
          className="font-inter font-medium text-white px-2 py-2 rounded-md mr-2"
        >
          My Collections
        </Link>
        <NavLink
          to="/create"
          className="font-inter font-medium bg-[#2c40b2] text-white px-4 py-2 rounded-md mr-2"
        >
          Create
        </NavLink>
        <NavLink
        onClick={logout}
          className="font-inter font-medium bg-[#1ad13f] text-white px-4 py-2 rounded-md"
        >
          Logout
        </NavLink>
      </div>
    </header>
 </>)
}
export default Nav