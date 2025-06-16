// Outlet, React Router component.It renders the matching child route inside the layout.
import { Outlet } from "react-router-dom";
import NavBar from "./Navbar";
// React component named Layout and exports it so it can be used elsewhere — for example, in App.jsx
export default function Layout() {
    return (
        <>
        <NavBar/>
        <Outlet/>
        </> 
    )
}