import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Header } from "./layout/Header";
import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
