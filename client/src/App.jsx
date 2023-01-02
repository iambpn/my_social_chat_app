import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import ErrorPage from "./pages/error.jsx";
import { ProtectedRoute } from "./helper/ProtectedRoute";
import Conversation from "./pages/conversation";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>home</div>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: (
      <ProtectedRoute isAuthenticated={false}>
        <Login />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: (
      <ProtectedRoute isAuthenticated={false}>
        <Register />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/conversation",
    element: (
      <ProtectedRoute isAuthenticated={false}>
        <Conversation />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
