import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

// =====================================================================
// GLOBAL AUTHCONTEXT
// Menyimpan status login untuk SEMUA halaman:
// - session  : sesi Supabase (berisi token), null kalau belum login
// - user     : data pengguna (email, nama), null kalau belum login
// - isLoading: true selama sesi tersimpan sedang dibaca saat aplikasi dibuka
// =====================================================================
type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Rehidrasi: saat aplikasi dibuka, baca sesi yang tersimpan di SecureStore
    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session))
      .catch(() => setSession(null))
      .finally(() => setIsLoading(false));

    // 2. Real-time session subscription: dipanggil setiap ada perubahan sesi
    //    (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, ...)
    const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth event:", event);
      setSession(newSession);
    });

    // 3. Berhenti berlangganan saat provider dilepas
    return () => data.subscription.unsubscribe();
  }, []);

  // Keluar: hapus sesi di server dan token di SecureStore
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) { throw new Error("useAuth harus digunakan di dalam AuthProvider"); }
  return context;
}
