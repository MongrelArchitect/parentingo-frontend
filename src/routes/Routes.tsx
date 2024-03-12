import { useContext } from "react";

// package imports
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

// contexts
import { UserContext } from "@contexts/Users";

// page module imports
import Dashboard from "@pages/Dashboard";
import ErrorPage from "@pages/ErrorPage";
import GroupDetail from "@pages/GroupDetail";
import Groups from "@pages/Groups";
import GroupsSummary from "@pages/GroupsSummary";
import Home from "@pages/Home";
import Login from "@pages/Login";
import NewGroup from "@pages/NewGroup";
import NotFound from "@pages/NotFound";
import PostDetail from "@pages/PostDetail";
import Root from "@pages/Root";
import SignUp from "@pages/SignUp";

function getRoutesWithUser() {
  return createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          element: <Dashboard />,
          children: [
            {
              index: true,
              element: <Home />,
            },
            {
              path: "newgroup",
              element: <NewGroup />,
            },
            {
              path: "/groups",
              element: <Groups />,
              children: [
                {
                  index: true,
                  element: <GroupsSummary />,
                },
                {
                  path: ":groupId",
                  element: <GroupDetail />,
                },
                {
                  path: ":groupId/posts/:postId",
                  element: <PostDetail />,
                },
              ],
            },
          ],
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ]);
}

function getRoutesWithoutUser() {
  return createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Login />,
        },
        {
          path: "/signup",
          element: <SignUp />,
        },
        {
          path: "*",
          element: <Navigate to="/" />,
        },
      ],
    },
  ]);
}

export default function Routes() {
  const { user } = useContext(UserContext);

  const router = user ? getRoutesWithUser() : getRoutesWithoutUser();

  return <RouterProvider router={router} />;
}
