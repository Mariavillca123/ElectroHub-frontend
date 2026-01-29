import { useState } from 'react';
import { Copy, Check, Tag, Clock, Users, Sparkles } from 'lucide-react';

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
}

const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'ELECTRONICA20',
    description: 'Descuento en componentes',
    discountType: 'percentage',
    discountValue: 20,
    minPurchase: 50,
    validUntil: new Date('2026-12-31'),
    maxUses: 100,
    usedCount: 75,
  },
  {
    id: '2',
    code: 'MAKER15',
    description: 'Especial para makers',
    discountType: 'percentage',
    discountValue: 15,
    minPurchase: 30,
    validUntil: new Date('2026-06-30'),
    maxUses: 200,
    usedCount: 45,
  },
  {
    id: '3',
    code: 'DESCUENTO50',
    description: 'Descuento directo',
    discountType: 'fixed',
    discountValue: 50,
    minPurchase: 200,
    validUntil: new Date('2026-03-31'),
    maxUses: 50,
    usedCount: 20,
  },
];

export default function CouponsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-accent/10 via-background to-primary/5 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent-foreground">
            <Sparkles className="h-4 w-4" />
            <span>Ofertas exclusivas</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Cupones de Descuento
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Aprovecha nuestros cupones exclusivos y ahorra en tus compras de componentes electrónicos.
            Copia el código y aplícalo en tu carrito.
          </p>
        </div>
      </section>

      {/* Coupons Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {mockCoupons.length === 0 ? (
            <div className="py-16 text-center">
              <Tag className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
              <h2 className="mb-2 text-xl font-semibold text-foreground">No hay cupones activos</h2>
              <p className="text-muted-foreground">Vuelve pronto para encontrar nuevas ofertas</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockCoupons.map((coupon) => {
                const usagePercentage = (coupon.usedCount / coupon.maxUses) * 100;
                const isAlmostGone = usagePercentage > 70;

                return (
                  <div
                    key={coupon.id}
                    className="group relative overflow-hidden rounded-xl border border-border bg-background shadow-sm transition-all hover:shadow-xl hover:border-primary/50"
                  >
                    {/* Discount Badge */}
                    <div className="absolute right-4 top-4">
                      <div className="inline-block rounded-lg bg-primary px-3 py-1 text-lg font-bold text-primary-foreground">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}% OFF`
                          : `$${coupon.discountValue} OFF`}
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Header */}
                      <div className="mb-4 flex items-center gap-2 text-muted-foreground">
                        <Tag className="h-4 w-4" />
                        <span className="text-sm">Cupón</span>
                      </div>
                      <h3 className="mb-4 text-xl font-semibold text-foreground">
                        {coupon.description}
                      </h3>

                      {/* Code Display */}
                      <div className="mb-4 flex items-center gap-2">
                        <div className="flex-1 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 px-4 py-3">
                          <p className="text-center font-mono text-xl font-bold tracking-wider text-primary">
                            {coupon.code}
                          </p>
                        </div>
                        <button
                          onClick={() => copyCode(coupon.code, coupon.id)}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted transition-colors"
                          title="Copiar código"
                        >
                          {copiedId === coupon.id ? (
                            <Check className="h-4 w-4 text-accent" />
                          ) : (
                            <Copy className="h-4 w-4 text-foreground" />
                          )}
                        </button>
                      </div>

                      {/* Details */}
                      <div className="mb-4 space-y-2 text-sm">
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span>Compra mínima:</span>
                          <span className="font-medium text-foreground">
                            ${coupon.minPurchase.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Válido hasta:</span>
                          </div>
                          <span className="font-medium text-foreground">
                            {formatDate(coupon.validUntil)}
                          </span>
                        </div>
                      </div>

                      {/* Usage Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>Usos disponibles</span>
                          </div>
                          <span
                            className={`font-medium ${
                              isAlmostGone ? 'text-destructive' : 'text-foreground'
                            }`}
                          >
                            {coupon.maxUses - coupon.usedCount} restantes
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full transition-all ${
                              isAlmostGone ? 'bg-destructive' : 'bg-primary'
                            }`}
                            style={{ width: `${100 - usagePercentage}%` }}
                          />
                        </div>
                        {isAlmostGone && (
                          <p className="text-xs font-medium text-destructive">
                            Por agotarse - Usa este cupón pronto
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* How to Use */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-2xl font-bold text-foreground">
            Cómo usar tu cupón
          </h2>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                1
              </div>
              <h3 className="mb-2 font-semibold">Copia el código</h3>
              <p className="text-sm text-muted-foreground">
                Haz clic en el botón de copiar junto al código del cupón
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                2
              </div>
              <h3 className="mb-2 font-semibold">Agrega productos</h3>
              <p className="text-sm text-muted-foreground">
                Navega por nuestro catálogo y agrega productos a tu carrito
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                3
              </div>
              <h3 className="mb-2 font-semibold">Aplica el descuento</h3>
              <p className="text-sm text-muted-foreground">
                Pega el código en el campo de cupón al finalizar tu compra
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
