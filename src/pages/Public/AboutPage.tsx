import { Users, Target, Lightbulb, Award, Facebook, Twitter, Linkedin, Globe, Zap, Rocket, Heart } from 'lucide-react';

export default function AboutPage() {
  const team = [
    {
      id: 1,
      name: 'Cristopher Farias',
      role: 'Fundador y CEO',
      description: 'Visionario en tecnología electrónica con 10+ años de experiencia.',
      image: '👨‍💼',
      social: { twitter: '#', linkedin: '#', facebook: '#' }
    },
    {
      id: 2,
      name: 'Belén Villca',
      role: 'Directora de Operaciones',
      description: 'Experta en gestión operacional y eficiencia de procesos.',
      image: '👩‍💼',
      social: { twitter: '#', linkedin: '#', facebook: '#' }
    },
    {
      id: 3,
      name: 'Ronald Hurtado',
      role: 'Ingeniero Electrónico Senior',
      description: 'Especialista en componentes y soluciones tecnológicas.',
      image: '👨‍🔬',
      social: { twitter: '#', linkedin: '#', facebook: '#' }
    },
    {
      id: 4,
      name: 'Karla Chicaiza',
      role: 'Atención al Cliente',
      description: 'Dedicada a proporcionar excelente servicio al cliente.',
      image: '👩‍💼',
      social: { twitter: '#', linkedin: '#', facebook: '#' }
    },
  ];

  const values = [
    { id: 1, title: 'Pasión', description: 'Amamos la electrónica. Cada componente es seleccionado con cuidado para tu éxito.', icon: Heart },
    { id: 2, title: 'Calidad', description: 'Solo trabajamos con proveedores certificados y productos de garantía confiable.', icon: Award },
    { id: 3, title: 'Comunidad', description: 'Apoyamos makers, estudiantes y profesionales en su jornada tecnológica.', icon: Users },
    { id: 4, title: 'Compromiso', description: 'Tu proyecto es importante. Nos comprometemos a ayudarte en cada paso.', icon: Target },
  ];

  const timeline = [
    { year: '2014', title: 'Inicio', description: 'Apertura de nuestra primera tienda física con visión de servicio' },
    { year: '2018', title: 'Digitalización', description: 'Lanzamos plataforma online para alcanzar más clientes' },
    { year: '2022', title: 'Expansión', description: 'Crecimiento a 5,000+ productos y 50,000 clientes satisfechos' },
    { year: '2024', title: 'Liderazgo', description: 'Consolidados como líderes en componentes electrónicos regionales' },
  ];

  const stats = [
    { value: '10+', label: 'Años en el mercado' },
    { value: '50K+', label: 'Clientes satisfechos' },
    { value: '5K+', label: 'Productos disponibles' },
    { value: '99%', label: 'Entregas exitosas' },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-accent/10 dark:from-primary/10 dark:via-gray-900 dark:to-accent/5 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,120,255,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_50%,rgba(0,120,255,0.05),transparent_50%)]" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl dark:bg-accent/5" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl dark:bg-primary/5" />
        </div>
        <div className="container relative mx-auto px-4 py-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 dark:border-primary/20 dark:bg-primary/5 px-4 py-2">
            <Rocket className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Desde 2014</span>
          </div>
          <h1 className="mb-4 text-5xl font-bold text-foreground dark:text-white md:text-6xl">
            Sobre <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ElectroMart</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground dark:text-gray-400">
            Tu tienda confiable para componentes electrónicos, herramientas para makers y soluciones tecnológicas innovadoras.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-border dark:border-gray-800 bg-muted/50 dark:bg-gray-900/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-2 text-4xl font-bold text-primary">{stat.value}</div>
                <p className="text-muted-foreground dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground dark:text-white">Nuestro Viaje</h2>
          <div className="mx-auto max-w-4xl">
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 dark:bg-primary/10 border-2 border-primary">
                      <span className="text-lg font-bold text-primary">{index + 1}</span>
                    </div>
                    {index !== timeline.length - 1 && (
                      <div className="mt-2 w-0.5 h-24 bg-primary/30 dark:bg-primary/20" />
                    )}
                  </div>
                  <div className="pb-8">
                    <div className="mb-2">
                      <span className="inline-block rounded-full bg-primary/10 dark:bg-primary/5 px-3 py-1 text-sm font-semibold text-primary">
                        {item.year}
                      </span>
                    </div>
                    <h3 className="mb-1 text-xl font-bold text-foreground dark:text-white">{item.title}</h3>
                    <p className="text-muted-foreground dark:text-gray-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="rounded-xl border border-border dark:border-gray-800 bg-muted/50 dark:bg-gray-900/50 p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 dark:bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-foreground dark:text-white">Nuestra Misión</h3>
              <p className="text-muted-foreground dark:text-gray-400">
                Democratizar el acceso a componentes electrónicos de calidad para que cualquier persona o empresa pueda innovar sin limitaciones. Creemos que la tecnología debe ser accesible, asequible y fácil de usar.
              </p>
            </div>
            <div className="rounded-xl border border-border dark:border-gray-800 bg-muted/50 dark:bg-gray-900/50 p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20 dark:bg-accent/10">
                <Rocket className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-foreground dark:text-white">Nuestra Visión</h3>
              <p className="text-muted-foreground dark:text-gray-400">
                Ser la plataforma líder en componentes electrónicos y soluciones tecnológicas en América Latina, conocida por calidad, confiabilidad y excelente servicio al cliente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="border-y border-border dark:border-gray-800 bg-muted/50 dark:bg-gray-900/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground dark:text-white">Nuestros Valores</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const IconComponent = value.icon;
              return (
                <div key={value.id} className="group rounded-lg border border-border dark:border-gray-800 bg-background dark:bg-gray-900 p-6 transition-all hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/30">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 dark:bg-primary/10 group-hover:scale-110 transition-transform">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground dark:text-white">{value.title}</h3>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground dark:text-white">Nuestro Equipo</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.id} className="group rounded-lg border border-border dark:border-gray-800 overflow-hidden bg-background dark:bg-gray-900 transition-all hover:shadow-xl hover:border-primary/50 dark:hover:border-primary/30">
                <div className="relative overflow-hidden bg-gradient-to-br from-primary/30 to-accent/20 dark:from-primary/10 dark:to-accent/5 px-6 py-8 text-center">
                  <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl dark:bg-primary/5 group-hover:scale-125 transition-transform" />
                  <div className="relative">
                    <div className="mb-4 text-6xl group-hover:scale-110 transition-transform">{member.image}</div>
                    <h3 className="mb-1 text-lg font-semibold text-foreground dark:text-white">{member.name}</h3>
                    <p className="mb-3 text-sm font-medium text-primary">{member.role}</p>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">{member.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3 border-t border-border dark:border-gray-800 bg-muted/50 dark:bg-gray-900/50 px-6 py-4">
                  <a href={member.social.twitter} className="rounded-lg p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/5 transition-all">
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a href={member.social.linkedin} className="rounded-lg p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/5 transition-all">
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a href={member.social.facebook} className="rounded-lg p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/5 transition-all">
                    <Facebook className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="border-t border-border dark:border-gray-800 bg-muted/50 dark:bg-gray-900/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-foreground dark:text-white">Nuestra Historia</h2>
          <div className="mx-auto max-w-3xl space-y-6">
            <p className="text-muted-foreground dark:text-gray-400">
              <span className="font-semibold text-foreground dark:text-white">ElectroMart</span> nació en 2014 como una pequeña tienda física con una visión simple: proporcionar componentes electrónicos de calidad a precios justos. Lo que comenzó como un emprendimiento modesto se transformó en una pasión por servir a la comunidad de makers y entusiastas de la tecnología.
            </p>
            <p className="text-muted-foreground dark:text-gray-400">
              En 2018, reconociendo la oportunidad digital, lanzamos nuestra plataforma en línea para alcanzar a clientes en toda la región, manteniendo el compromiso con la calidad que nos caracteriza. Hemos crecido exponencialmente mientras mantuvimos nuestra esencia.
            </p>
            <p className="text-muted-foreground dark:text-gray-400">
              Hoy, servimos a más de 50,000 clientes con un catálogo de 5,000+ productos. Pero nuestra misión sigue siendo la misma: hacer que la tecnología sea accesible para todos. Cada día, trabajamos para innovar, mejorar y mantener los más altos estándares de servicio.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground dark:text-white">¿Preguntas o Sugerencias?</h2>
          <p className="mb-8 text-muted-foreground dark:text-gray-400">Estamos aquí para ayudarte. Contáctanos en cualquier momento.</p>
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:flex-wrap">
            <a
              href="mailto:info@electromart.com"
              className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg dark:hover:shadow-primary/20"
            >
              Enviar Email
            </a>
            <a
              href="tel:+1234567890"
              className="rounded-lg border border-primary bg-background dark:bg-gray-900 px-6 py-3 font-semibold text-primary hover:bg-primary/10 dark:hover:bg-primary/5 transition-colors"
            >
              Llamar Ahora
            </a>
            <a
              href="#"
              className="flex items-center gap-2 rounded-lg border border-border dark:border-gray-800 bg-background dark:bg-gray-900 px-6 py-3 font-semibold text-foreground dark:text-white hover:bg-muted dark:hover:bg-gray-800 transition-colors"
            >
              <Globe className="h-4 w-4" />
              Visitar Sitio Web
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
