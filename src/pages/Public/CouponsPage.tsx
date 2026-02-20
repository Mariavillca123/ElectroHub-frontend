import { useState } from 'react';
import { Copy, Check, Tag, Clock, Users, Sparkles, Gift, TrendingDown } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  validUntil: Date;
  maxUses: number;
  usedCount: number;
  category?: string;
  badge?: string;
}

const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'ELECTRONICA20',
    description: 'Descuento en componentes electrónicos',
    discountType: 'percentage',
    discountValue: 20,
    minPurchase: 50,
    validUntil: new Date('2026-12-31'),
    maxUses: 100,
    usedCount: 75,
    category: 'Componentes',
    badge: '🔥 HOT'
  },
  {
    id: '2',
    code: 'MAKER15',
    description: 'Especial para makers y proyectos DIY',
    discountType: 'percentage',
    discountValue: 15,
    minPurchase: 30,
    validUntil: new Date('2026-06-30'),
    maxUses: 200,
    usedCount: 45,
    category: 'Makers'
  },
  {
    id: '3',
    code: 'DESCUENTO50',
    description: 'Descuento directo en compra grande',
    discountType: 'fixed',
    discountValue: 50,
    minPurchase: 200,
    validUntil: new Date('2026-03-31'),
    maxUses: 50,
    usedCount: 20,
    category: 'Premium',
    badge: '⭐ PREMIUM'
  },
  {
    id: '4',
    code: 'TECH2024',
    description: 'Promoción especial de primavera',
    discountType: 'percentage',
    discountValue: 25,
    minPurchase: 75,
    validUntil: new Date('2026-04-30'),
    maxUses: 150,
    usedCount: 120,
    category: 'Estacional'
  },
  {
    id: '5',
    code: 'STUDENT10',
    description: 'Descuento para estudiantes verificados',
    discountType: 'percentage',
    discountValue: 10,
    minPurchase: 20,
    validUntil: new Date('2026-08-31'),
    maxUses: 300,
    usedCount: 85,
    category: 'Estudiantes',
    badge: '🎓 STUDENT'
  },
  {
    id: '6',
    code: 'WELCOME5',
    description: 'Bienvenida para nuevos clientes',
    discountType: 'percentage',
    discountValue: 5,
    minPurchase: 0,
    validUntil: new Date('2026-12-31'),
    maxUses: 999,
    usedCount: 234,
    category: 'Nuevos',
  },
];

export default function CouponsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getDaysLeft = (date: Date) => {
    const today = new Date();
    const diffTime = new Date(date).getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const categories = ['all', ...new Set(mockCoupons.map(c => c.category))];
  const filteredCoupons = selectedFilter === 'all' 
    ? mockCoupons 
    : mockCoupons.filter(c => c.category === selectedFilter);

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-accent/20 via-background to-primary/5 dark:from-accent/10 dark:via-gray-900 dark:to-primary/5 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(16,185,129,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_30%,rgba(16,185,129,0.05),transparent_50%)]" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl dark:bg-accent/5" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl dark:bg-primary/5" />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 dark:border-accent/20 dark:bg-accent/5 px-4 py-2">
            <Gift className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Ofertas Exclusivas</span>
          </div>
          <h1 className="mb-4 text-5xl font-bold text-foreground dark:text-white md:text-6xl">
            Cupones de <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Descuento</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground dark:text-gray-400">
            Aprovecha nuestros cupones exclusivos y ahorra en tus compras. Copia el código y aplícalo en tu carrito para obtener tu descuento al instante.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="border-b border-border dark:border-gray-800 bg-muted/30 dark:bg-gray-900/30 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedFilter === category
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-background dark:bg-gray-800 border border-border dark:border-gray-700 text-foreground dark:text-gray-300 hover:border-primary dark:hover:border-primary'
                }`}
              >
                {category === 'all' ? 'Todos' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Coupons Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredCoupons.length === 0 ? (
            <div className="py-16 text-center">
              <Tag className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
              <h2 className="mb-2 text-xl font-semibold text-foreground dark:text-white">No hay cupones en esta categoría</h2>
              <p className="text-muted-foreground dark:text-gray-400">Selecciona otra categoría para ver más cupones</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCoupons.map((coupon) => {
                const usagePercentage = (coupon.usedCount / coupon.maxUses) * 100;
                const isAlmostGone = usagePercentage > 70;
                const daysLeft = getDaysLeft(coupon.validUntil);
                const isExpiringSoon = daysLeft <= 7 && daysLeft > 0;

                return (
                  <div
                    key={coupon.id}
                    className="group relative overflow-hidden rounded-xl border border-border dark:border-gray-800 bg-background dark:bg-gray-900 shadow-md transition-all duration-300 hover:shadow-xl hover:border-primary/50 dark:hover:border-primary/30 hover:-translate-y-1"
                  >
                    {/* Badge */}
                    {coupon.badge && (
                      <div className="absolute right-4 top-4 z-10">
                        <span className="inline-block rounded-lg bg-gradient-to-r from-primary to-accent px-3 py-1 text-xs font-bold text-white shadow-lg">
                          {coupon.badge}
                        </span>
                      </div>
                    )}

                    {/* Discount Badge */}
                    <div className="absolute right-4 top-14">
                      <div className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-primary to-accent px-3 py-1 text-lg font-bold text-white shadow-lg">
                        {coupon.discountType === 'percentage' ? (
                          <>
                            <TrendingDown className="h-4 w-4" />
                            <span>{coupon.discountValue}%</span>
                          </>
                        ) : (
                          <>
                            <span>${coupon.discountValue}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Header */}
                      <div className="mb-4 flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                        <Tag className="h-4 w-4" />
                        <span className="text-xs font-medium uppercase tracking-wide">Cupón</span>
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-foreground dark:text-white">
                        {coupon.description}
                      </h3>
                      {coupon.category && (
                        <p className="mb-4 text-xs text-muted-foreground dark:text-gray-500 font-medium">
                          {coupon.category}
                        </p>
                      )}

                      {/* Code Display */}
                      <div className="mb-4 flex items-center gap-2">
                        <div className="flex-1 rounded-lg border-2 border-dashed border-primary/30 dark:border-primary/20 bg-primary/5 dark:bg-primary/5 px-4 py-3">
                          <p className="text-center font-mono text-sm font-bold tracking-widest text-primary">
                            {coupon.code}
                          </p>
                        </div>
                        <button
                          onClick={() => copyCode(coupon.code, coupon.id)}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border dark:border-gray-700 bg-background dark:bg-gray-800 hover:bg-primary/10 dark:hover:bg-primary/10 transition-all group/btn"
                          title="Copiar código"
                        >
                          {copiedId === coupon.id ? (
                            <Check className="h-4 w-4 text-accent animate-pulse" />
                          ) : (
                            <Copy className="h-4 w-4 text-foreground dark:text-gray-300 group-hover/btn:text-primary" />
                          )}
                        </button>
                      </div>

                      {/* Details */}
                      <div className="mb-4 space-y-2 text-sm border-t border-border dark:border-gray-800 pt-4">
                        <div className="flex items-center justify-between text-muted-foreground dark:text-gray-400">
                          <span>Compra mínima:</span>
                          <span className="font-medium text-foreground dark:text-white">
                            ${coupon.minPurchase.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-muted-foreground dark:text-gray-400">
                            <Clock className="h-3 w-3" />
                            <span>Válido hasta:</span>
                          </div>
                          <span className={`font-medium ${
                            isExpiringSoon 
                              ? 'text-destructive font-bold' 
                              : 'text-foreground dark:text-white'
                          }`}>
                            {formatDate(coupon.validUntil)}
                            {isExpiringSoon && (
                              <span className="ml-1 text-xs">⏰</span>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Usage Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground dark:text-gray-400">
                            <Users className="h-3 w-3" />
                            <span>Disponibles</span>
                          </div>
                          <span
                            className={`font-medium ${
                              isAlmostGone ? 'text-destructive' : 'text-foreground dark:text-white'
                            }`}
                          >
                            {coupon.maxUses - coupon.usedCount} / {coupon.maxUses}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted dark:bg-gray-800">
                          <div
                            className={`h-full transition-all duration-500 ${
                              isAlmostGone 
                                ? 'bg-gradient-to-r from-destructive to-red-500' 
                                : 'bg-gradient-to-r from-accent to-primary'
                            }`}
                            style={{ width: `${usagePercentage}%` }}
                          />
                        </div>
                        {isAlmostGone && (
                          <p className="text-xs font-medium text-destructive animate-pulse">
                            ⚠️ Últimas unidades disponibles
                          </p>
                        )}
                      </div>

                      {/* Apply Button */}
                      <button
                        onClick={() => copyCode(coupon.code, coupon.id)}
                        className="mt-6 w-full rounded-lg bg-gradient-to-r from-primary to-accent py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-primary/20 dark:hover:shadow-primary/10"
                      >
                        {copiedId === coupon.id ? 'Código Copiado ✓' : 'Copiar y Usar'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* How to Use */}
      <section className="border-t border-border dark:border-gray-800 bg-muted/50 dark:bg-gray-900/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-3xl font-bold text-foreground dark:text-white">
            Cómo usar tu cupón
          </h2>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-border dark:border-gray-800 bg-background dark:bg-gray-900 p-6 text-center transition-all hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/30">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 dark:from-primary/10 dark:to-accent/10 text-2xl font-bold text-primary">
                1
              </div>
              <h3 className="mb-2 font-semibold text-foreground dark:text-white">Copia el código</h3>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Haz clic en el botón "Copiar y Usar" junto al código
              </p>
            </div>
            <div className="rounded-lg border border-border dark:border-gray-800 bg-background dark:bg-gray-900 p-6 text-center transition-all hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/30">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 dark:from-primary/10 dark:to-accent/10 text-2xl font-bold text-primary">
                2
              </div>
              <h3 className="mb-2 font-semibold text-foreground dark:text-white">Agrega productos</h3>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Navega por nuestro catálogo y agrega productos a tu carrito
              </p>
            </div>
            <div className="rounded-lg border border-border dark:border-gray-800 bg-background dark:bg-gray-900 p-6 text-center transition-all hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/30">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 dark:from-primary/10 dark:to-accent/10 text-2xl font-bold text-primary">
                3
              </div>
              <h3 className="mb-2 font-semibold text-foreground dark:text-white">Aplica el descuento</h3>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Pega el código en el carrito y obtén tu descuento al instante
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl rounded-xl border border-border dark:border-gray-800 bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/5 dark:to-accent/5 p-8 text-center">
            <Sparkles className="mx-auto mb-4 h-8 w-8 text-primary" />
            <h3 className="mb-2 text-2xl font-bold text-foreground dark:text-white">
              Suscríbete para nuevos cupones
            </h3>
            <p className="mb-6 text-muted-foreground dark:text-gray-400">
              Recibe cupones exclusivos y ofertas especiales directamente en tu bandeja de entrada
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 rounded-lg border border-border dark:border-gray-700 bg-background dark:bg-gray-900 px-4 py-3 text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="rounded-lg bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-white transition-all hover:shadow-lg dark:hover:shadow-primary/20">
                Suscribirse
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
