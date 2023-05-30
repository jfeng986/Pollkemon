import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const rootContainer: HTMLElement = document.getElementById(
  "root"
) as HTMLElement;
const root = ReactDOM.createRoot(rootContainer);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
