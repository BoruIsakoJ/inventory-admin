import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './layout/DashboardLayout';
import Home from './pages/home/Home';
import Users from './pages/userList/UserList';
import User from './pages/user/User';
import NewUser from './pages/newUser/NewUser';
import CategoryList from './pages/categoryList/CategoryList';
import Category from './pages/category/Category';
import NewCategory from './pages/newCategory/NewCategory';
import ProductList from './pages/productList/ProductList';
import Product from './pages/product/Product';
import NewProduct from './pages/newProduct./NewProduct';
import SupplierList from './pages/supplierList/SupplierList';
import Supplier from './pages/supplier/Supplier';
import NewSupplier from './pages/newSupplier/NewSupplier';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />

        <Route path='/dashboard' element={<DashboardLayout/>}>
          <Route index element={<Home/>}/>
          <Route path='users' element={<Users/>}/>
          <Route path='user/:id' element={<User/>} /> 
          <Route path='newUser' element={<NewUser/>}/>
          <Route path='categories' element={<CategoryList/>}/>
          <Route path='categories/:id' element={<Category/>}/>
          <Route path='newCategory' element={<NewCategory/>}/>
          <Route path='products' element={<ProductList/>}/>
          <Route path='products/:id'element={<Product/>}/>
          <Route path='newProduct' element={<NewProduct/>}/>
          <Route path='suppliers' element={<SupplierList/>}/>
          <Route path='suppliers/:id' element={<Supplier/>}/>
          <Route path='newSupplier' element={<NewSupplier/>}/>
        </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
