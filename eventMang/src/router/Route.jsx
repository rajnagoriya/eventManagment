import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Layout } from "../layout/Layout";
import Loader from "../component/common/Loader";



// Lazy-loaded components
const Home = lazy(() => import("../pages/Home"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<Loader />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: (
          <div className="h-[100vh] w-[100vw] text-[2rem] font-bold text-white bg-black flex justify-center items-center">
            Page not found !!
          </div>
        ),
      },
    ],
  },
]);