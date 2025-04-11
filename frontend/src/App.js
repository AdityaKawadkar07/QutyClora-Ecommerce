import './App.css';
import Navbar from './components/navbar/Navbar';
import { BrowserRouter,Routes,Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import ShopCategory from './pages/ShopCategory'
import ContactUs from './pages/ContactUs'
import Product from './pages/Product'
import Cart from './pages/Cart'
import LoginSignup from './pages/LoginSignup';
import Footer from './components/Footer/Footer';
import Shop from './pages/Shop';
import { BrowserRouter as Router } from 'react-router-dom';
import PlaceOrder from './components/PlaceOrder/PlaceOrder';
import Forgot from './pages/Forgot';
import ResetPasswordPage from './pages/ResetPassword';
import MyOrder from './pages/MyOrder';
import FloatingButton from './components/FloatingButton/FloatingButton';
import 'quill/dist/quill.snow.css';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path='/order' element={<PlaceOrder/>}/>
        <Route path='/forgotpassword' element={<Forgot/>}/>
        <Route path="/reset-password/:resetToken" element={<ResetPasswordPage/>} />
        <Route path="/my-order/:id" element={<MyOrder/>}/>
      </Routes>
      {location.pathname !== "/login" && <Footer />}
      <FloatingButton/>
    </div>
  );
}

export default App;