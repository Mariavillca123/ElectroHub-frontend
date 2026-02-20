import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { items } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xl sm:text-2xl font-bold text-primary">ElectroHub</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 lg:space-x-8 items-center">
          <Link to="/" className="text-sm lg:text-base hover:text-primary transition">Inicio</Link>
          <Link to="/ofertas" className="text-sm lg:text-base hover:text-primary transition">Ofertas</Link>
          <Link to="/cupones" className="text-sm lg:text-base hover:text-primary transition">Cupones</Link>
          <Link to="/sobre-nosotros" className="text-sm lg:text-base hover:text-primary transition">Sobre nosotros</Link>
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex space-x-4 lg:space-x-6 items-center">
          <Link to="/carrito" className="relative inline-flex items-center gap-1 lg:gap-2 hover:text-primary transition text-sm lg:text-base">
            <ShoppingCart className="h-5 w-5" />
            <span className="hidden lg:inline">Carrito</span>
            {items.length > 0 && (
              <span className="absolute -top-2 -right-3 rounded-full bg-primary text-white text-xs px-1.5 py-0.5">
                {items.length}
              </span>
            )}
          </Link>
          <Link to="/registro" className="text-sm lg:text-base hover:text-primary transition">Registrarse</Link>
          <Link to="/login" className="bg-primary text-white px-3 lg:px-4 py-2 rounded-lg text-sm lg:text-base hover:bg-blue-700 transition">
            Iniciar sesión
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <Link to="/carrito" className="relative inline-flex items-center gap-1 hover:text-primary transition">
            <ShoppingCart className="h-5 w-5" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-3 rounded-full bg-primary text-white text-xs px-1.5 py-0.5">
                {items.length}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              to="/"
              className="block text-sm hover:text-primary transition py-2"
              onClick={() => setIsOpen(false)}
            >
              Inicio
            </Link>
            <Link
              to="/ofertas"
              className="block text-sm hover:text-primary transition py-2"
              onClick={() => setIsOpen(false)}
            >
              Ofertas
            </Link>
            <Link
              to="/cupones"
              className="block text-sm hover:text-primary transition py-2"
              onClick={() => setIsOpen(false)}
            >
              Cupones
            </Link>
            <Link
              to="/sobre-nosotros"
              className="block text-sm hover:text-primary transition py-2"
              onClick={() => setIsOpen(false)}
            >
              Sobre nosotros
            </Link>
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <Link
                to="/registro"
                className="block text-sm hover:text-primary transition py-2"
                onClick={() => setIsOpen(false)}
              >
                Registrarse
              </Link>
              <Link
                to="/login"
                className="block bg-primary text-white px-4 py-2 rounded-lg text-sm text-center hover:bg-blue-700 transition"
                onClick={() => setIsOpen(false)}
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
