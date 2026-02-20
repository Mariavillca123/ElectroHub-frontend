import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "../../utils/axios"
import ProductCard from "../../components/ui/ProductCard"
import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/Button"
import ElectroBorder from "../../components/ui/ElectroBorder"
import { ArrowRight, Zap, Truck, Shield, Headphones, Tag, TrendingUp } from "lucide-react"
import fondoImage from "../../assets/fondo.jpg"

interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  discount?: number
}

const features = [
  {
    icon: Truck,
    title: 'Envío Rápido',
    description: 'Entregas en 24-48 horas en toda la ciudad',
  },
  {
    icon: Shield,
    title: 'Garantía',
    description: 'Todos nuestros productos tienen garantía',
  },
  {
    icon: Headphones,
    title: 'Soporte Técnico',
    description: 'Asesoría especializada para tus proyectos',
  },
  {
    icon: Tag,
    title: 'Mejores Precios',
    description: 'Precios competitivos en el mercado',
  },
]

const categories = [
  {
    name: "Microcontroladores",
    icon: "🎮",
    slug: "microcontroladores",
    description: "Pequeños computadores completos en un chip.",
    borderColor: "#93c5fd",
  },
  {
    name: "Componentes",
    icon: "⚡",
    slug: "componentes",
    description: "Elementos básicos que, al interconectarse, forman circuitos electrónicos para controlar la electricidad y las señales.",
    borderColor: "#fcd34d",
  },
  {
    name: "Sensores",
    icon: "📡",
    slug: "sensores",
    description: "Dispositivos que convierten una magnitud física del mundo real en una señal eléctrica",
    borderColor: "#d8b4fe",
  },
  {
    name: "Comunicación",
    icon: "📶",
    slug: "comunicacion",
    description: "Dispositivos o módulos que permiten el intercambio de datos entre sistemas electrónicos.",
    borderColor: "#7dd3fc",
  },
  {
    name: "Pantallas",
    icon: "🖥️",
    slug: "pantallas",
    description: "Dispositivos de salida que muestran información visual generada por un sistema electrónico.",
    borderColor: "#6ee7b7",
  },
  {
    name: "Accesorios",
    icon: "🔧",
    slug: "accesorios",
    description: "Componentes auxiliares que complementan un sistema electrónico.",
    borderColor: "#fdba74",
  },
  {
    name: "Motores",
    icon: "⚙️",
    slug: "motores",
    description: "Dispositivos que convierten energía eléctrica en movimiento mecánico.",
    borderColor: "#fda4af",
  },
  {
    name: "Cables",
    icon: "🔌",
    slug: "cables",
    description: "Conductores que transmiten señales eléctricas entre componentes electrónicos.",
    borderColor: "#a5b4fc",
  },
]

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products")
        const products = response.data || []
        setFeaturedProducts(products.slice(0, 8))
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
        style={{
          backgroundImage: `url(${fondoImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: window.innerWidth > 768 ? 'fixed' : 'scroll'
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-32 relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm text-blue-600">
              <Zap className="h-4 w-4" />
              <span>Tu ventaja electrónica</span>
            </div>
            <h1 className="mb-4 sm:mb-6 text-2xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-white">
              Componentes electrónicos de calidad para tus proyectos
            </h1>
            <p className="mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg text-white/90">
              Encuentra resistencias, capacitores, microcontroladores, sensores y todo lo que necesitas para dar vida a tus ideas. Precios competitivos y envío rápido.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/ofertas">
                <Button size="lg" className="gap-2">
                  Ver Ofertas
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 sm:py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-10 text-center">
            <h2 className="mb-2 sm:mb-3 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Explora Nuestras Categorías</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Todo lo que necesitas para tus proyectos electrónicos</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {categories.map((category) => (
              <Link key={category.name} to={`/productos?category=${category.slug}`}>
                <ElectroBorder
                  borderColor={category.borderColor}
                  borderWidth={3}
                  glow
                  aura
                  animationSpeed={0}
                  className="rounded-2xl"
                >
                  <Card className="group cursor-pointer overflow-hidden rounded-2xl bg-white/95 dark:bg-gray-800/95 transition-all hover:-translate-y-1 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="mb-4 text-4xl">
                        {category.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {category.description}
                      </p>
                    </CardContent>
                  </Card>
                </ElectroBorder>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="mb-1 sm:mb-2 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Productos Destacados</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Los más vendidos de nuestra tienda</p>
            </div>
            <Link to="/productos" className="hidden sm:block">
              <Button variant="outline" className="gap-2 text-sm">
                Ver todos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Cargando productos...</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="mt-6 text-center sm:hidden">
                <Link to="/productos">
                  <Button variant="outline" className="gap-2">
                    Ver todos los productos
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl sm:rounded-2xl bg-blue-600 dark:bg-blue-900 p-6 sm:p-8 lg:p-12 text-center">
            <div className="mx-auto max-w-2xl">
              <TrendingUp className="mx-auto mb-3 sm:mb-4 h-10 sm:h-12 w-10 sm:w-12 text-white/80" />
              <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                ¿Eres vendedor de componentes?
              </h2>
              <p className="mb-4 sm:mb-6 text-sm sm:text-base text-white/90">
                Únete a nuestra plataforma y llega a miles de clientes. Gestiona tu inventario, ventas y reportes desde un solo lugar.
              </p>
              <Link to="/registro?role=vendedor">
                <Button size="lg" className="gap-2 bg-white !text-gray-900 hover:bg-gray-100 text-sm sm:text-base">
                  Regístrate como Vendedor
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
