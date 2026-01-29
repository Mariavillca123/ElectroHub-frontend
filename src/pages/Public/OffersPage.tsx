import { useEffect, useState } from "react"
import axios from "../../utils/axios"
import ProductCard from "../../components/ui/ProductCard"
import { Tag } from "lucide-react"

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

export default function OffersPage() {
  const [productsByCategory, setProductsByCategory] = useState<ProductsByCategory>({})
  const [loading, setLoading] = useState(true)

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
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Cargando ofertas...</div>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sin ofertas disponibles</h2>
        <p className="text-gray-600">Volveremos pronto con increíbles descuentos</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Ofertas Especiales</h1>
        <p className="text-gray-600">{totalOffers} productos con descuento exclusivos para ti</p>
      </div>

      <div className="space-y-12">
        {categories.map(category => (
          <div key={category}>
            {/* Category Header */}
            <div className="mb-6 pb-4 border-b-2 border-blue-600">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                  {productsByCategory[category].length}
                </span>
                {category}
              </h2>
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

      {/* Call to Action */}
      <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-center text-white">
        <h3 className="text-2xl font-bold mb-2">¿No encontraste lo que buscas?</h3>
        <p className="mb-4">Explora nuestro catálogo completo de productos</p>
        <a
          href="/productos"
          className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Ver todos los productos
        </a>
      </div>
    </div>
  )
}
