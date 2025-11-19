import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Header } from "./layout/Header";
import { Dashboard } from "./pages/Dashboard";
import { PlantDetailPage } from "@/pages/PlantDetailPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col w-3/4 min-h-screen mx-auto justify-start">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/plants/:id" element={<PlantDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
