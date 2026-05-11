import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { AuthProvider } from "../context/AuthContext";
import { SearchProvider } from "../context/SearchContext";
import { AnimatedBackground } from "../components/AnimatedBackground";

export function Root() {
  return (
    <AuthProvider>
      <SearchProvider>
        <div className="min-h-screen flex flex-col bg-[#0a0a0f] relative">
          <AnimatedBackground />
          <Navbar />
          <main className="flex-1 relative z-10">
            <Outlet />
          </main>
          <Footer />
        </div>
      </SearchProvider>
    </AuthProvider>
  );
}
