import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { AuthProvider } from "./context/AuthContext.jsx";
// import { AuthProvider } from "./context/AuthContext.js";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId="656859918486-vstnudots6oljklkq2vq8au0jtdmbmqa.apps.googleusercontent.com">
      <AuthProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </AuthProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>
);
