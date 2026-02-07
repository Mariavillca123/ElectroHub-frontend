import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../../utils/axios";
import { UserPlus, Store, ShoppingBag, Eye, EyeOff, Check } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get("role");
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: (roleFromUrl === "vendedor" ? "vendedor" : "cliente") as "cliente" | "vendedor"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = (password: string) => {
    let score = 0;

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    const labels = [
      "Muy debil",
      "Debil",
      "Media",
      "Aceptable",
      "Buena",
      "Fuerte"
    ];
    const colors = [
      "bg-red-400",
      "bg-orange-400",
      "bg-yellow-400",
      "bg-amber-400",
      "bg-lime-500",
      "bg-emerald-500"
    ];

    const clampedScore = Math.min(score, 5);

    return {
      score: clampedScore,
      maxScore: 5,
      label: labels[clampedScore],
      colorClass: colors[clampedScore]
    };
  };

  const strength = getPasswordStrength(form.password);
  const strengthValue = Math.round((strength.score / strength.maxScore) * 10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("/api/auth/register", form);
      alert("¡Registro exitoso! Ahora puedes iniciar sesión");
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Crear Cuenta</h1>
            <p className="text-muted-foreground mt-2">Únete a ElectroHub</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Tipo de cuenta
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "cliente" })}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    form.role === "cliente"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <ShoppingBag className={`h-6 w-6 ${form.role === "cliente" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-medium ${form.role === "cliente" ? "text-primary" : "text-foreground"}`}>
                    Cliente
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "vendedor" })}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    form.role === "vendedor"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Store className={`h-6 w-6 ${form.role === "vendedor" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-medium ${form.role === "vendedor" ? "text-primary" : "text-foreground"}`}>
                    Vendedor
                  </span>
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Juan Pérez"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="correo@ejemplo.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full px-4 py-2 pr-12 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {strength.score >= 4 && (
                    <Check className="h-4 w-4 text-emerald-500" />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Fortaleza: {strength.label}</span>
                  <span>{strengthValue}/10</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                  <div
                    className={`h-1.5 rounded-full transition-all ${strength.colorClass}`}
                    style={{ width: `${(strength.score / strength.maxScore) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="button-floating"
            >
              {loading ? "Registrando..." : "Crear cuenta"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="text-primary font-medium hover:underline">
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}