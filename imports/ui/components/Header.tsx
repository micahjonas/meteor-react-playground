import React from "react";
// @ts-ignore
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Button } from "./Button";

export const Header = () => {
  const user = useTracker(() => Meteor.user()) as Meteor.User;
  console.log(user);

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1>Appointments</h1>
      {!!user && (
        <div className="flex gap-6 items-center">
          <p>{user.username}</p>
          <Button
            variant="secondary"
            onClick={() => {
              Meteor.logout();
            }}
          >
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};
