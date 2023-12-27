import { Routes, Route } from "react-router-dom";
import NotfoundPage from "./pages/notfoundPage";
import Default from "./pages/default";

export default function RoutesConfig() {
  return (
    <Routes>
      <Route path="/" element={<Default />} />
      <Route path="/*" element={<NotfoundPage />} />
    </Routes>
  );
}
