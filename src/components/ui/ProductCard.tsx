import { useCart } from "../../contexts/CartContext"
import { Card, CardContent, CardFooter } from "./card"
import { Button } from "./Button"
import { Badge } from "./Badge"
import { ShoppingCart, Package, Check } from "lucide-react"
import { useState } from "react"

interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  discount?: number
  image?: string
  vendor_name?: string
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [addedSuccess, setAddedSuccess] = useState(false)

  // Normaliza valores que pueden venir como string desde la API
  const price = Number(product.price) || 0
  const discount = product.discount ? Number(product.discount) || 0 : 0
  const discountedPrice = discount > 0 ? price * (1 - discount / 100) : null

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      return
    }
    
    setIsAdding(true)
    
    // Simulamos la animación
    setTimeout(() => {
      setIsAdding(false)
      setAddedSuccess(true)
      addToCart({ id: product.id, name: product.name, price, quantity: 1 })
      
      // Mostrar el estado de éxito por 2 segundos
      setTimeout(() => {
        setAddedSuccess(false)
      }, 2000)
    }, 300)
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-16 w-16 text-gray-400" />
          </div>
        )}
        {product.discount && (
          <Badge variant="destructive" className="absolute left-2 top-2">
            -{product.discount}%
          </Badge>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <Badge variant="secondary" className="absolute right-2 top-2">
            Últimas {product.stock} unidades
          </Badge>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <Badge variant="destructive">Agotado</Badge>
          </div>
        )}
      </div>
      <CardContent>
        <p className="text-xs text-gray-600">{product.category}</p>
        <h3 className="mt-1 line-clamp-2 font-semibold text-gray-900">{product.name}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          {discountedPrice !== null ? (
            <>
              <span className="text-lg font-bold text-blue-600">${discountedPrice.toFixed(2)}</span>
              <span className="text-sm text-gray-600 line-through">${price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-blue-600">${price.toFixed(2)}</span>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-600">Stock: {product.stock} unidades</p>
        {product.vendor_name && (
          <p className="mt-2 text-xs font-medium text-blue-600 border-t pt-2">
            Vendedor: <span className="font-semibold">{product.vendor_name}</span>
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className={`w-full transition-all duration-300 ${
            addedSuccess 
              ? "bg-green-600 hover:bg-green-700" 
              : isAdding 
              ? "opacity-75 scale-95" 
              : ""
          }`}
          onClick={handleAddToCart} 
          disabled={product.stock === 0 || addedSuccess}
        >
          {addedSuccess ? (
            <>
              <Check className="mr-2 h-4 w-4 animate-pulse" />
              ¡Agregado!
            </>
          ) : isAdding ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
              Agregando...
            </>
          ) : product.stock === 0 ? (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Sin stock
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Agregar al carrito
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
