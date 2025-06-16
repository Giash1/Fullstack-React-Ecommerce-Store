// <Link> is a React Router component used to create navigation links in your app without reloading the page.
import { Link } from "react-router-dom"
export default function NavBar() {
    return (
        <nav>
            <ul>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/about'>About</Link></li>
                <li><Link to='/product'>Product</Link></li>
                <li><Link to='/products'>Products List</Link></li> {/* also fixed path */}
            </ul>
        </nav>
    );
}
