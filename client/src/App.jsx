import React from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import "./App.css";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import ErrorPage from "./pages/error.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <div />,
        errorElement: <ErrorPage />
    },
    {
        path: "/login",
        element: <Login />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/register",
        element: <Register />,
        errorElement: <ErrorPage />,
    }
]);

function App() {
    return (
        <RouterProvider router={router} />
    );
}

export default App;
