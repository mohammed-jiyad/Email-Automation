import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import EmailDetails from "./pages/EmailDetails";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/emails/:id" element={<EmailDetails />} />
    </Routes>
  );
}
