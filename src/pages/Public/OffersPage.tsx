import { useEffect, useState } from "react"
import axios from "../../utils/axios"
import ProductCard from "../../components/ui/ProductCard"
import { Tag, Clock, Zap, TrendingDown } from "lucide-react"

interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  discount?: number
}

interface ProductsByCategory {
  [key: string]: Product[]
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function OffersPage() {
  const [productsByCategory, setProductsByCategory] = useState<ProductsByCategory>({})
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Fake end date for offer (7 days from now)
  const getOfferEndDate = () => {
    const end = new Date()
    end.setDate(end.getDate() + 7)
    end.setHours(23, 59, 59, 999)
    return end
  }

  const [offerEndDate] = useState(getOfferEndDate())

  // Countdown timer logic
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime()
      const end = offerEndDate.getTime()
      const distance = end - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((distance / 1000 / 60) % 60),
          seconds: Math.floor((distance / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [offerEndDate])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products")
        const allProducts = response.data || []

        // Filtrar solo productos con descuento
        const offerProducts = allProducts.filter((p: Product) => p.discount && p.discount > 0)

        // Agrupar por categoría
        const grouped = offerProducts.reduce((acc: ProductsByCategory, product: Product) => {
          if (!acc[product.category]) {
            acc[product.category] = []
          }
          acc[product.category].push(product)
          return acc
        }, {})

        setProductsByCategory(grouped)
      } catch (error) {
        console.error("Error fetching offers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const categories = Object.keys(productsByCategory).sort()
  const totalOffers = Object.values(productsByCategory).reduce((sum, arr) => sum + arr.length, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 min-h-screen bg-background dark:bg-gray-950">
        <div className="text-gray-500 dark:text-gray-400">Cargando ofertas...</div>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12 min-h-screen bg-background dark:bg-gray-950 flex items-center justify-center">
        <div>
          <Tag className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sin ofertas disponibles</h2>
          <p className="text-gray-600 dark:text-gray-400">Volveremos pronto con increíbles descuentos</p>
        </div>
      </div>
    )
  }

  const CountdownTimer = () => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="rounded-lg border border-border dark:border-gray-800 bg-background dark:bg-gray-900 p-3 text-center">
        <div className="text-xl sm:text-2xl font-bold text-primary">{String(timeLeft.days).padStart(2, '0')}</div>
        <div className="text-xs text-muted-foreground dark:text-gray-500 mt-1">Días</div>
      </div>
      <div className="rounded-lg border border-border dark:border-gray-800 bg-background dark:bg-gray-900 p-3 text-center">
        <div className="text-xl sm:text-2xl font-bold text-primary">{String(timeLeft.hours).padStart(2, '0')}</div>
        <div className="text-xs text-muted-foreground dark:text-gray-500 mt-1">Horas</div>
      </div>
      <div className="rounded-lg border border-border dark:border-gray-800 bg-background dark:bg-gray-900 p-3 text-center">
        <div className="text-xl sm:text-2xl font-bold text-primary">{String(timeLeft.minutes).padStart(2, '0')}</div>
        <div className="text-xs text-muted-foreground dark:text-gray-500 mt-1">Minutos</div>
      </div>
      <div className="rounded-lg border border-border dark:border-gray-800 bg-background dark:bg-gray-900 p-3 text-center">
        <div className="text-xl sm:text-2xl font-bold text-primary">{String(timeLeft.seconds).padStart(2, '0')}</div>
        <div className="text-xs text-muted-foreground dark:text-gray-500 mt-1">Segundos</div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-accent/10 dark:from-primary/10 dark:via-gray-900 dark:to-accent/5 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(0,120,255,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_30%,rgba(0,120,255,0.05),transparent_50%)]" />
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 dark:border-primary/20 dark:bg-primary/5 px-4 py-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Ofertas Limitadas</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground dark:text-white md:text-5xl mb-2">
              Ofertas <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Especiales</span>
            </h1>
            <p className="text-muted-foreground dark:text-gray-400 mb-6">{totalOffers} productos con descuento exclusivos para ti</p>
            
            {/* Countdown Timer */}
            <div className="max-w-md mx-auto">
              <div className="mb-4 flex items-center justify-center gap-2 text-sm text-muted-foreground dark:text-gray-400">
                <Clock className="h-4 w-4 text-destructive animate-pulse" />
                <span>La oferta termina en:</span>
              </div>
              <CountdownTimer />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-12">
          {categories.map(category => (
            <div key={category}>
              {/* Category Header */}
              <div className="mb-8 pb-4 border-b-2 border-primary dark:border-primary/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground dark:text-white flex items-center gap-3">
                    <span className="bg-gradient-to-r from-primary to-accent rounded-full px-3 py-1 text-sm font-medium text-white inline-block">
                      {productsByCategory[category].length}
                    </span>
                    {category}
                  </h2>
                  <div className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground dark:text-gray-400">
                    <TrendingDown className="h-4 w-4 text-accent" />
                    Hasta 50% OFF
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                {productsByCategory[category].map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 border-t border-border dark:border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 dark:from-primary/10 dark:to-accent/10 border border-border dark:border-gray-800 p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground dark:text-white mb-2">¿No encontraste lo que buscas?</h3>
            <p className="text-muted-foreground dark:text-gray-400 mb-6">
              Explora nuestro catálogo completo de productos
            </p>
            <a
              href="/productos"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all dark:hover:shadow-primary/20"
            >
              <Zap className="h-4 w-4" />
              Ver todos los productos
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
