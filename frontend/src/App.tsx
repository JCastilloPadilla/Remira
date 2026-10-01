import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AnalysisPage from "@/features/analysis/AnalysisPage";
import { LandingPage } from "@/features/landing/LandingPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/analizar" element={<AnalysisPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
