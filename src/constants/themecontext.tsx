import { createContext, useContext, useEffect, useState, type ReactNode, } from "react";

type ThemeContextType = { darkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>( undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    console.log(`Tema aktif: ${darkMode ? "Dark Mode" : "Light Mode"}`);
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((previous) => !previous); };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) { throw new Error("useTheme harus digunakan di dalam ThemeProvider"); }
  return context;
}
