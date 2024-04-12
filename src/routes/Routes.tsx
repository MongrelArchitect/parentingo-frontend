import { useContext } from "react";

// package imports
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// contexts
import { UserContext } from "@contexts/Users";

// components
import Redirect from "@components/Redirect";

// page module imports
import AllGroups from "@pages/AllGroups";
import Dashboard from "@pages/Dashboard";
import ErrorPage from "@pages/ErrorPage";
import GroupDeleted from "@pages/GroupDeleted";
import GroupDetail from "@pages/GroupDetail";
import Home from "@pages/Home";
import Login from "@pages/Login";
import MyGroups from "@pages/MyGroups";
import NewGroup from "@pages/NewGroup";
import NotFound from "@pages/NotFound";
import PostDeleted from "@pages/PostDeleted";
import PostDetail from "@pages/PostDetail";
import Root from "@pages/Root";
import SignUp from "@pages/SignUp";
import UserDetail from "@pages/UserDetail";

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
              path: "allgroups",
              element: <AllGroups />,
            },
            {
              path: "mygroups",
              element: <MyGroups />,
            },
            {
              path: "groups/deleted",
              element: <GroupDeleted />,
            },
            {
              path: "groups/:groupId",
              element: <GroupDetail />,
            },
            {
              path: "groups/:groupId/posts/deleted",
              element: <PostDeleted />,
            },
            {
              path: "groups/:groupId/posts/:postId",
              element: <PostDetail />,
            },
            {
              path: "users/:userId",
              element: <UserDetail />
            },
          ],
        },
        {
          path: "/login",
          element: <Redirect path="/"/>,
        },
        {
          path: "/signup",
          element: <Redirect path="/"/>,
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
          element: <Login />,
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
