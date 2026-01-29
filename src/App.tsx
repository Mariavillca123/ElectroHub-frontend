import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/Public/HomePage";
import ProductsPage from "./pages/Public/ProductsPage";
import OffersPage from "./pages/Public/OffersPage";
import AboutPage from "./pages/Public/AboutPage";
import CouponsPage from "./pages/Public/CouponsPage";
import CartPage from "./pages/Public/CartPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import VendorPage from "./pages/Dashboard/VendorPage";
import VendorProductsPage from "./pages/Dashboard/VendorProductsPage";
import VendorSalesPage from "./pages/Dashboard/VendorSalesPage";
import VendorClientsPage from "./pages/Dashboard/VendorClientsPage";
import VendorReportsPage from "./pages/Dashboard/VendorReportsPage";
import AdminPage from "./pages/Dashboard/AdminPage";
import AdminProductsPage from "./pages/Dashboard/AdminProductsPage";
import CustomerPage from "./pages/Dashboard/CustomerPage";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

export default function App() {
  const location = useLocation();
  
  // Rutas donde NO queremos mostrar Navbar/Footer (dashboards)
  const isDashboardRoute = location.pathname.startsWith('/vendedor') || 
                          location.pathname.startsWith('/admin') || 
                          location.pathname.startsWith('/cliente');

  return (
    <div className="flex flex-col min-h-screen">
      {!isDashboardRoute && <Navbar />}
      <main className={isDashboardRoute ? "" : "flex-1 container mx-auto px-4 py-6"}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/ofertas" element={<OffersPage />} />
          <Route path="/cupones" element={<CouponsPage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/sobre-nosotros" element={<AboutPage />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />

          {/* Dashboard */}
          <Route path="/vendedor" element={<VendorPage />} />
          <Route path="/vendedor/productos" element={<VendorProductsPage />} />
          <Route path="/vendedor/ventas" element={<VendorSalesPage />} />
          <Route path="/vendedor/clientes" element={<VendorClientsPage />} />
          <Route path="/vendedor/reportes" element={<VendorReportsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/cliente/*" element={<CustomerPage />} />
        </Routes>
      </main>
      {!isDashboardRoute && <Footer />}
    </div>
  );
}


