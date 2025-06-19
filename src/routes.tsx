import { Routes, Route } from "react-router-dom";
import NotfoundPage from "./notfoundPage";
import App from "./App";

export default function RoutesConfig() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/*" element={<NotfoundPage />} />
    </Routes>
  );
}
