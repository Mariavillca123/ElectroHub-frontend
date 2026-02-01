import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "../../utils/axios";
import { Lock, Mail, Shield } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Redirigir si ya está logueado
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else if (user.role === "vendor") {
        navigate("/vendedor", { replace: true });
      } else {
        navigate("/cliente", { replace: true });
      }
    }
  }, [user, navigate]);
  
  // Detectar si es login de admin por el hash
  const isAdminLogin = location.hash === "#admin";

  useEffect(() => {
    if (isAdminLogin) {
      setForm({ email: "admin@electrohub.com", password: "" });
    }
  }, [isAdminLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!form.email || !form.password) {
      setError("Por favor completa todos los campos");
      return;
    }
    
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/login", {
        ...form,
        isAdmin: isAdminLogin
      });

      const { token, user: userData } = response.data;
      
      if (!token || !userData) {
        setError("Respuesta inválida del servidor");
        setLoading(false);
        return;
      }
      
      // Usar el contexto para guardar
      login(userData, token);
      // La navegación se maneja en el useEffect de arriba
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              {isAdminLogin ? (
                <Shield className="h-8 w-8 text-primary" />
              ) : (
                <Lock className="h-8 w-8 text-primary" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {isAdminLogin ? "Acceso Administrativo" : "Iniciar Sesión"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isAdminLogin ? "Panel de administración" : "Bienvenido de nuevo"}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  required
                  readOnly={isAdminLogin}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  placeholder="correo@ejemplo.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Contraseña
              </label>
              <input
                type="password"
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="button-floating"
            >
              {loading ? "Iniciando..." : "Iniciar sesión"}
            </button>
          </form>

          {!isAdminLogin && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              ¿No tienes cuenta?{" "}
              <a href="/registro" className="text-primary font-medium hover:underline">
                Regístrate
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}