import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductDetail from "./pages/ProductDetail";
import CreateProduct from "./pages/CreateProduct";
import AdminRoute from "./components/AdminRoute";
import Cart from "./pages/Cart";
import OrdersPage from "./pages/OrdersPage";
import CategoryPage from "./pages/CategoryPage";
import EditProduct from "./pages/EditProduct";
import AdminProducts from "./pages/AdminProducts";
import Layout from "./components/Layout";

import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import ContactPage from "./pages/ContactPage";

import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<Register />} />

            {/* Main layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<App />} />
              <Route
                path="dashboard"
                element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
              />
              <Route
                path="admin/pedidos"
                element={<AdminRoute><OrdersPage /></AdminRoute>}
              />
              <Route
                path="crear-producto"
                element={<AdminRoute><CreateProduct /></AdminRoute>}
              />
              <Route
                path="admin/productos"
                element={<AdminRoute><AdminProducts /></AdminRoute>}
              />
              <Route
                path="editar-producto/:id"
                element={<AdminRoute><EditProduct /></AdminRoute>}
              />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="categoria/:categoria" element={<CategoryPage />} />
              <Route path="categoria/:categoria/:subcategoria" element={<CategoryPage />} />
              <Route path="carrito" element={<Cart />} />

              <Route path="terminos" element={<TermsPage />} />
              <Route path="privacidad" element={<PrivacyPage />} />
              <Route path="contacto" element={<ContactPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </UserProvider>
  </React.StrictMode>
);
