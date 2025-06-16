
//  importing React Router functions to set up  client-side routing.
// The router create and then pass into <RouterProvider />.
import {
  // Creates a router that uses the browser's History API.
  createBrowserRouter, 
  //  Makes the router available throughout app (like a context provider)
  RouterProvider,
} from 'react-router-dom';
import './App.css'
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import ProductPage from './pages/productPage';
import ProductsListPage from './pages/ProductsListPage';
import Layout from './pages/Layout';

// an array of route objects.
// React Router uses this array to build a routing map.
const routes = [{
  path: '/',
  element: <Layout />,
  children: [{
    path: '/',
    element:<HomePage/>
  },
  {
    path: '/about',
    element:<AboutPage/>
    },
    {
      path: '/product',
      element:<ProductPage/>
    },
    {
      path: '/products',
      element:<ProductsListPage/>
    }
  ]
 
}]
// convert the route array into a real router object that React Router can understand and
//  then pass it to the main App component below
const router = createBrowserRouter(routes);
function App() {

  return (
    // <Component propName={value} />
    // Activates the router inside the app
// Makes routing information (like current URL, navigation functions) available to all child components
    <RouterProvider router={router} /> 
  );
}

export default App
