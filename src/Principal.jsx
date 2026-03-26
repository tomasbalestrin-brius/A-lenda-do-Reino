import React, { useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "./store/useAuthStore";
import { AuthOverlay } from "./components/auth/AuthOverlay";
import { PWAUpdateToast } from "./components/PWAUpdateToast";
import { OfflineBanner } from "./components/OfflineBanner";
import { LandscapeWarning } from "./components/LandscapeWarning";
import "./index.css";

const CharacterCreation = lazy(() => import("./components/CharacterCreation"));

const LoadingScreen = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center"
  >
    <div className="relative mb-8">
      <div className="w-20 h-20 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl animate-pulse">⚔️</span>
      </div>
    </div>
    <h2 className="text-amber-500 font-black uppercase tracking-[0.4em] text-sm animate-pulse">
      Convocando as Lendas...
    </h2>
    <p className="text-slate-600 text-[10px] mt-4 uppercase tracking-widest font-black">Preparando o Reino de Arton</p>
  </motion.div>
);

export default function App() {
  const { user, loading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (loading) return <LoadingScreen />;
  if (!user) return <AuthOverlay />;

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <OfflineBanner />
      <LandscapeWarning />
      <Suspense fallback={<LoadingScreen />}>
        <CharacterCreation />
      </Suspense>
      <PWAUpdateToast />
    </div>
  );
}
