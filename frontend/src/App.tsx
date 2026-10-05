import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AnalysisPage from "@/features/analysis/AnalysisPage";
import { LandingPage } from "@/features/landing/LandingPage";
import { LoginPage } from "@/features/auth/LoginPage";
import { InboxPage } from "@/features/inbox/InboxPage";
import { HistoryPage } from "@/features/history/HistoryPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/analizar" element={<AnalysisPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/bandeja" element={<InboxPage />} />
        <Route path="/historial" element={<HistoryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
