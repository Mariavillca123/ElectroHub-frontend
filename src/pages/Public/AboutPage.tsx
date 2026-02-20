import { Zap, Users, Target, Heart, Award, Clock, Package, Headphones } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Pasion por la Electronica',
    description: 'Amamos lo que hacemos. Cada componente que vendemos esta pensado para ayudarte a crear cosas increibles.',
  },
  {
    icon: Award,
    title: 'Calidad Garantizada',
    description: 'Trabajamos solo con proveedores de confianza para asegurar que recibas productos de la mejor calidad.',
  },
  {
    icon: Users,
    title: 'Comunidad Maker',
    description: 'Creemos en el poder de la comunidad. Apoyamos a estudiantes, hobbyistas y profesionales por igual.',
  },
  {
    icon: Target,
    title: 'Compromiso',
    description: 'Tu proyecto es importante para nosotros. Nos comprometemos a ayudarte a completarlo con exito.',
  },
];

const stats = [
  { value: '10K+', label: 'Clientes satisfechos' },
  { value: '5K+', label: 'Productos disponibles' },
  { value: '99%', label: 'Entregas exitosas' },
  { value: '24/7', label: 'Soporte disponible' },
];

const team = [
  { name: 'Cristopher Farias', role: 'Fundador y CEO', initial: 'CR' },
  { name: 'Belén Villca', role: 'Directora de Operaciones', initial: 'BV' },
  { name: 'Ronald Hurtado', role: 'Ingeniero Electronico Senior', initial: 'RH' },
  { name: 'Karla Chicaiza', role: 'Atencion al Cliente', initial: 'KC' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Zap className="h-4 w-4" />
              <span>Conocenos</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-foreground md:text-5xl text-balance">
              Impulsando tus proyectos electronicos desde 2020
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Somos un equipo apasionado por la electronica y la tecnologia. 
              Nacimos con la mision de hacer accesibles los componentes electronicos 
              de calidad para todos: desde el estudiante que construye su primer circuito 
              hasta el ingeniero que desarrolla el proximo gran invento.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-foreground">Nuestra Mision</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  En ElectroHub creemos que la electronica es el lenguaje del futuro. 
                  Por eso, nuestra mision es simple: hacer que cada persona tenga acceso 
                  a los componentes que necesita para aprender, crear e innovar.
                </p>
                <p>
                  No somos solo una tienda de componentes. Somos tu aliado en cada proyecto. 
                  Ya sea que estes construyendo un robot para la escuela, automatizando tu hogar, 
                  o desarrollando el prototipo de tu startup, estamos aqui para apoyarte.
                </p>
                <p>
                  Nos enorgullece ofrecer precios justos, envios rapidos y un servicio 
                  al cliente que realmente entiende lo que necesitas. Porque sabemos que 
                  cuando un LED no enciende a las 2 AM, necesitas a alguien que entienda tu frustracion.
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-background shadow-sm transition-colors hover:shadow-lg bg-primary/5 border-primary/20">
                <div className="flex flex-col items-center p-6 text-center">
                  <Package className="mb-3 h-10 w-10 text-primary" />
                  <h3 className="font-semibold text-foreground">Envio Rapido</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Entregas en 24-48 horas</p>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-background shadow-sm transition-colors hover:shadow-lg bg-accent/5 border-accent/20">
                <div className="flex flex-col items-center p-6 text-center">
                  <Clock className="mb-3 h-10 w-10 text-accent-foreground" />
                  <h3 className="font-semibold text-foreground">Disponibilidad</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Stock actualizado en tiempo real</p>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-background shadow-sm transition-colors hover:shadow-lg bg-accent/5 border-accent/20">
                <div className="flex flex-col items-center p-6 text-center">
                  <Award className="mb-3 h-10 w-10 text-accent-foreground" />
                  <h3 className="font-semibold text-foreground">Garantia</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Productos 100% originales</p>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-background shadow-sm transition-colors hover:shadow-lg bg-primary/5 border-primary/20">
                <div className="flex flex-col items-center p-6 text-center">
                  <Headphones className="mb-3 h-10 w-10 text-primary" />
                  <h3 className="font-semibold text-foreground">Soporte</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Asesoria tecnica especializada</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-border bg-muted/20 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-foreground">Nuestros Valores</h2>
            <p className="text-muted-foreground">Lo que nos define y guia cada dia</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="rounded-xl border border-border bg-background shadow-sm transition-colors text-center hover:shadow-lg hover:border-primary/50">
                <div className="p-6">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-foreground">Nuestro Equipo</h2>
            <p className="text-muted-foreground">Las personas detras de ElectroHub</p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.name} className="rounded-xl border border-border bg-background shadow-sm transition-colors text-center hover:shadow-lg">
                <div className="p-6">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                    {member.initial}
                  </div>
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
            Listo para empezar tu proximo proyecto?
          </h2>
          <p className="mb-6 text-white/80">
            Explora nuestro catalogo y encuentra todo lo que necesitas
          </p>
          <a 
            href="/productos" 
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-medium text-black transition-colors hover:bg-gray-100"
          >
            Ver Productos
            <Zap className="h-4 w-4 text-black" />
          </a>
        </div>
      </section>
    </div>
  );
}
