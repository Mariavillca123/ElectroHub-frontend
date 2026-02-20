import { useCart } from "../../contexts/CartContext"
import { useStockReminder } from "../../contexts/StockReminderContext"
import { Card, CardContent, CardFooter } from "./card"
import { Button } from "./Button"
import { Badge } from "./Badge"
import { ShoppingCart, Package, Check, Heart, Share2, Bell } from "lucide-react"
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
  description?: string
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { addReminder, hasReminder, removeReminder } = useStockReminder()
  const [isAdding, setIsAdding] = useState(false)
  const [addedSuccess, setAddedSuccess] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [reminderActive, setReminderActive] = useState(() => hasReminder(product.id))

  // Normaliza valores que pueden venir como string desde la API
  const price = Number(product.price) || 0
  const discount = product.discount && Number(product.discount) > 0 ? Number(product.discount) : 0
  const discountedPrice = discount > 0 ? price * (1 - discount / 100) : null
  const stockPercentage = (product.stock / 100) * 100 // Asume max 100 unidades

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
      
      // Mostrar el estado de éxito por 3 segundos
      setTimeout(() => {
        setAddedSuccess(false)
      }, 3000)
    }, 300)
  }

  const handleShare = () => {
    const text = `Mira este producto: ${product.name} - $${discountedPrice ? discountedPrice.toFixed(2) : price.toFixed(2)}`
    if (navigator.share) {
      navigator.share({
        title: 'ElectroHub',
        text: text,
        url: window.location.href
      })
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(`${product.name} - $${discountedPrice ? discountedPrice.toFixed(2) : price.toFixed(2)}`)
      alert('Producto copiado al portapapeles')
    }
  }

  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
    // Aquí puedes agregar lógica para guardar favoritos
  }

  const handleStockReminder = () => {
    if (reminderActive) {
      removeReminder(product.id)
      setReminderActive(false)
    } else {
      // Usar email del usuario o un valor por defecto
      const userEmail = localStorage.getItem('userEmail') || 'user@electromart.com'
      addReminder(product.id, product.name, userEmail)
      setReminderActive(true)
    }
  }

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-4">
        {/* Skeleton Loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )}

        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            onLoad={() => setImageLoaded(true)}
            className={`h-full w-full object-contain transition-transform duration-300 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-16 w-16 text-gray-400 dark:text-gray-600" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start gap-2">
          <div className="flex gap-2 flex-wrap">
            {discount > 0 && (
              <Badge variant="destructive" className="bg-red-500 hover:bg-red-600">
                -{discount}%
              </Badge>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                Últimas {product.stock}
              </Badge>
            )}
          </div>
        </div>

        {/* Favorite & Share Buttons */}
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleFavorite}
            className={`p-2 rounded-lg backdrop-blur-sm transition-all ${
              isFavorited
                ? 'bg-red-500 text-white'
                : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
            }`}
            aria-label="Agregar a favoritos"
          >
            <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 backdrop-blur-sm transition-all"
            aria-label="Compartir"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 dark:bg-black/60">
            <Badge variant="destructive" className="text-base">Agotado</Badge>
          </div>
        )}

        {/* Stock Progress Bar */}
        {product.stock > 0 && product.stock <= 20 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
            <div
              className={`h-full transition-all duration-500 ${
                product.stock <= 5 ? 'bg-red-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 tracking-wide">
            {product.category}
          </p>
          <h3 className="mt-1.5 line-clamp-2 font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price Section */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            {discountedPrice !== null ? (
              <>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  ${price.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-green-600 dark:text-green-400 ml-auto">
                  Ahorras ${(price - discountedPrice).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                ${price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Stock Status */}
        <div className="flex items-center justify-between">
          <p className={`text-xs font-medium ${
            product.stock === 0 
              ? 'text-red-600 dark:text-red-400'
              : product.stock <= 5
              ? 'text-orange-600 dark:text-orange-400'
              : 'text-green-600 dark:text-green-400'
          }`}>
            {product.stock === 0 ? 'Sin stock' : `${product.stock} disponibles`}
          </p>
        </div>

        {/* Vendor Name */}
        {product.vendor_name && (
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2">
            Vendedor: <span className="text-blue-600 dark:text-blue-400">{product.vendor_name}</span>
          </p>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter>
        {product.stock === 0 ? (
          <Button 
            className={`w-full transition-all duration-300 ${
              reminderActive 
                ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600" 
                : "bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
            }`}
            onClick={handleStockReminder}
          >
            <Bell className={`mr-2 h-4 w-4 ${reminderActive ? 'animate-pulse' : ''}`} />
            {reminderActive ? 'Recordatorio activo' : 'Notificarme'}
          </Button>
        ) : (
          <Button 
            className={`w-full transition-all duration-300 ${
              addedSuccess 
                ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600" 
                : isAdding 
                ? "opacity-75 scale-95" 
                : ""
            }`}
            onClick={handleAddToCart} 
            disabled={addedSuccess}
          >
            {addedSuccess ? (
              <>
                <Check className="mr-2 h-4 w-4 animate-pulse" />
                <span className="animate-bounce">¡Agregado!</span>
              </>
            ) : isAdding ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                Agregando...
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Agregar al carrito
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
