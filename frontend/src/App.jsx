import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import EmailDetails from "./pages/EmailDetails";
import WorkflowTester from "./pages/WorkflowTester";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/emails/:id" element={<EmailDetails />} />
      <Route path="/tester" element={<WorkflowTester />} />

    </Routes>
  );
}
