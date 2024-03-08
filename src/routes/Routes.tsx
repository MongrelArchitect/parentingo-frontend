import { useContext } from "react";

// package imports
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// contexts
import { UserContext } from "@contexts/Users";

// page module imports
import Dashboard from "@pages/Dashboard";
import ErrorPage from "@pages/ErrorPage";
import Home from "@pages/Home";
import Login from "@pages/Login";
import NewGroup from "@pages/NewGroup";
import NotFound from "@pages/NotFound";
import Root from "@pages/Root";
import SignUp from "@pages/SignUp";

export default function Routes() {
  const { user } = useContext(UserContext);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          element: user ? <Dashboard /> : <Login />,
          children: [
            {
              index: true,
              element: <Home/>,
            },
            {
              path: "newgroup",
              element: <NewGroup />,
            },
          ],
        },
        {
          path: "/signup",
          element: <SignUp />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
