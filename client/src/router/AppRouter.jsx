import { createBrowserRouter, RouterProvider } from "react-router";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/LoginPage";
import Register from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import MainLayout from "../layouts/MainLayout";
import ProductDetailPage from "../pages/ProductDetailPage";
import ProductFormPage from "../pages/ProductFormPage";
import ProductUpdatePage from "../pages/ProductUpdatePage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthLayout />,
        children: [
            {
                path: "",
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            }
        ]
    },
    {
        path: "/main",
        element: <MainLayout />,
        children: [
            {
                path: "",
                element: <HomePage />
            },
            {
                path: "products/new",
                element: <ProductFormPage />
            },
            {
                path: "products/:id",
                element: <ProductDetailPage />
            },
            {
                path: "products/:id/update",
                element: <ProductUpdatePage />
            }
        ]
    }
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;