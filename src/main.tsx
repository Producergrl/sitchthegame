import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Restore theme from localStorage (default: dark)
const stored = localStorage.getItem('theme');
if (stored === 'light') {
  document.documentElement.classList.remove('dark');
} else {
  document.documentElement.classList.add('dark');
}

createRoot(document.getElementById("root")!).render(<App />);
