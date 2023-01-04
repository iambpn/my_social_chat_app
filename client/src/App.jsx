import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import ErrorPage from "./pages/error.jsx";
import { ProtectedRoute } from "./helper/ProtectedRoute";
import Conversation from "./pages/conversation";
import { Navigate } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={"/register"} replace={true} />,
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
      <ProtectedRoute isAuthenticated={true}>
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
