import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const { items } = useCart();
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-2 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">ElectroHub</span>
        </Link>

        <div className="space-x-8 flex items-center">
          <Link to="/" className="hover:text-primary">Inicio</Link>
          <Link to="/ofertas" className="hover:text-primary">Ofertas</Link>
          <Link to="/cupones" className="hover:text-primary">Cupones</Link>
          <Link to="/sobre-nosotros" className="hover:text-primary">Sobre nosotros</Link>
        </div>

        <div className="space-x-6 flex items-center">
          <Link to="/carrito" className="relative inline-flex items-center gap-2 hover:text-primary">
            <ShoppingCart className="h-5 w-5" />
            <span>Carrito</span>
            {items.length > 0 && (
              <span className="absolute -top-2 -right-3 rounded-full bg-primary text-white text-xs px-2 py-0.5">
                {items.length}
              </span>
            )}
          </Link>
          <Link to="/registro" className="hover:text-primary">Registrarse</Link>
          <Link to="/login" className="bg-primary text-white px-4 py-2 rounded-lg">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </nav>
  );
}
