import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from "meteor/react-meteor-data";
import { MainPage } from "./pages/MainPage";
import { LoginPage } from "./pages/LoginPage";

export const App = () => {
  const user = useTracker(() => Meteor.user());

  // const logout = () => Meteor.logout();

  if (!user) {
    return (
      <LoginPage />
    );
  }


  // return <div>
  //   <h1>Welcome to App!</h1>
  // </div>;
  return <MainPage />;

}

);
