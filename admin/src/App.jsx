import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Admin from './Pages/Admin/Admin';
import { AuthContext } from './Context/AuthContext';
import Login from './Components/Login/Login';
import AddProduct from './Components/AddProduct/AddProduct';
import ListProduct from './Components/ListProduct/ListProduct';
import UserList from './Components/UserList/UserList';
import Orders from './Components/Orders/Orders';
import UserMessage from './Components/UserMessage/UserMessage';
import AddCoupon from './Components/AddCoupon/AddCoupon';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);
  console.log("ProtectedRoute - Auth State:", auth); // Debugging

  return auth ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>}>
            <Route path="addproduct" element={<AddProduct />} />
            <Route path="listproduct" element={<ListProduct />} />
            <Route path="userlist" element={<UserList />} />
            <Route path="orders" element={<Orders />} />
            <Route path="usermessage" element={<UserMessage />} />
            <Route path="add-coupon" element={<AddCoupon />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
};


export default App;
