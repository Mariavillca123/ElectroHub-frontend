import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import ProductCard from "../../components/ui/ProductCard"
import { Card, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
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
  { name: "Microcontroladores", icon: "🎮", slug: "microcontroladores" },
  { name: "Sensores", icon: "📡", slug: "sensores" },
  { name: "Componentes", icon: "⚡", slug: "componentes" },
  { name: "Comunicación", icon: "📶", slug: "comunicacion" },
  { name: "Motores", icon: "⚙️", slug: "motores" },
  { name: "Accesorios", icon: "🔧", slug: "accesorios" }
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
        className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50"
        style={{
          backgroundImage: `url(${fondoImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-600">
              <Zap className="h-4 w-4" />
              <span>Tu ventaja electrónica</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
              Componentes electrónicos de calidad para tus proyectos
            </h1>
            <p className="mb-8 text-lg text-white/90">
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
      <section className="border-b border-gray-200 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">Explora Nuestras Categorías</h2>
            <p className="text-gray-600">Todo lo que necesitas para tus proyectos electrónicos</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link key={category.name} to={`/productos?category=${category.slug}`}>
                <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:border-blue-500">
                  <CardContent className="p-6">
                    <div className="mb-4 text-4xl">
                      {category.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="border-t border-gray-200 bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-gray-900">Productos Destacados</h2>
              <p className="text-gray-600">Los más vendidos de nuestra tienda</p>
            </div>
            <Link to="/productos" className="hidden sm:block">
              <Button variant="outline" className="gap-2">
                Ver todos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Cargando productos...</div>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-blue-600 p-8 text-center md:p-12">
            <div className="mx-auto max-w-2xl">
              <TrendingUp className="mx-auto mb-4 h-12 w-12 text-white/80" />
              <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
                ¿Eres vendedor de componentes?
              </h2>
              <p className="mb-6 text-white/90">
                Únete a nuestra plataforma y llega a miles de clientes. Gestiona tu inventario, ventas y reportes desde un solo lugar.
              </p>
              <Link to="/registro?role=vendedor">
                <Button size="lg" className="gap-2 bg-white !text-gray-900 hover:bg-gray-100">
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
