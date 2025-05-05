import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage";
import Home from "./pages/HomePage";
import Students from "./pages/Students";
import Performance from "./pages/Performance";
import GameDashboard from "./pages/GameDashboard";
import "antd/dist/reset.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/students" element={<Students />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/game-dashboard" element={<GameDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
