import React from "react";
import { Accounts } from "meteor/accounts-base";
import { useTracker } from "meteor/react-meteor-data";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { MainPage } from "./pages/MainPage";
import { LoginPage } from "./pages/LoginPage";
import { Layout } from "./pages/Layout";
import { Protected } from "./components/Protected";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        element: (
          <Protected>
            <MainPage />
          </Protected>
        ),
      },
      {
        path: "login",
        Component: LoginPage,
      },
    ],
  },
]);

export const App = () => {
  // figure out if the accounts system is ready to avoid a flash of the login page
  const accountsReady = useTracker(
    () => Accounts.loginServicesConfigured(),
    []
  );

  if (!accountsReady) {
    // everything is ready pretty fast so a loading spinner would just be annoying flicker
    return <></>;
    // return <div>Loading...</div>;
  }

  return <RouterProvider router={router} />;
};
