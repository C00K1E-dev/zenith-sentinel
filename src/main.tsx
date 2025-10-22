import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from '@vercel/speed-insights';

createRoot(document.getElementById("root")!).render(<App />);

inject();
injectSpeedInsights();
