// package imports
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// page module imports
import ErrorPage from "@pages/ErrorPage";
import Landing from "@pages/Landing";
import NotFound from "@pages/NotFound";
import Root from "@pages/Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Root />
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default function Routes() {
  return (
    <RouterProvider router={router} />
  );
}
