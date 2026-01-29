import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "vendor" | "client";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const normalizeRole = (role: string): User["role"] => {
    const lowerRole = String(role).toLowerCase().trim();
    if (lowerRole === "vendedor") return "vendor";
    if (lowerRole === "cliente") return "client";
    if (lowerRole === "admin") return "admin";
    if (lowerRole === "vendor") return "vendor";
    if (lowerRole === "client") return "client";
    // Si no coincide con ninguno, retornar "client" por defecto (no admin)
    console.warn(`Rol desconocido recibido: ${role}, usando 'client' por defecto`);
    return "client";
  };

  // Cargar sesión desde localStorage al iniciar
  useEffect(() => {
    const raw = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (raw && token) {
      try {
        const u = JSON.parse(raw);
        const normalized: User = { ...u, role: normalizeRole(u.role) };
        setUser(normalized);
      } catch {
        // si falla el parse, limpiar
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    
    setLoading(false);
  }, []);

  const login = (u: any, token: string) => {
    const normalized: User = { ...u, role: normalizeRole(u.role) };
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(normalized));
    setUser(normalized);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
