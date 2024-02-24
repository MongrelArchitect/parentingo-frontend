// package imports
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// contexts
import UserContextProvider from "@contexts/Users";

// page module imports
import ErrorPage from "@pages/ErrorPage";
import Landing from "@pages/Landing";
import NotFound from "@pages/NotFound";
import Root from "@pages/Root";
import SignUp from "@pages/SignUp";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <UserContextProvider>
         <Root />
      </UserContextProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Landing />,
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

export default function Routes() {
  return (
    <RouterProvider router={router} />
  );
}
