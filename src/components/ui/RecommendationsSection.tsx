import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import ProductCard from './ProductCard';
import { Sparkles, ChevronRight } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  discount?: number;
  image?: string;
}

interface RecommendationsSectionProps {
  title?: string;
  subtitle?: string;
  category?: string;
  limit?: number;
}

export default function RecommendationsSection({
  title = 'Quizá te interese',
  subtitle = 'Productos recomendados especialmente para ti',
  category,
  limit = 4,
}: RecommendationsSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get('/api/products');
        let allProducts = response.data || [];

        // Filter by category if specified
        if (category) {
          allProducts = allProducts.filter(
            (p: Product) => p.category.toLowerCase() === category.toLowerCase()
          );
        }

        // Shuffle and get random products
        const shuffled = allProducts.sort(() => 0.5 - Math.random());
        setProducts(shuffled.slice(0, limit));
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [category, limit]);

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 border-t border-border dark:border-gray-800 bg-gradient-to-b from-background to-muted/50 dark:from-gray-950 dark:to-gray-900/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 dark:border-primary/20 dark:bg-primary/5 px-4 py-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Recomendaciones</span>
          </div>
          <h2 className="mb-2 text-3xl font-bold text-foreground dark:text-white md:text-4xl">
            {title}
          </h2>
          <p className="text-muted-foreground dark:text-gray-400">{subtitle}</p>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <a
            href="/productos"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-primary bg-background dark:bg-gray-900 px-6 py-3 font-semibold text-primary hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary transition-all group"
          >
            Ver todos los productos
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
