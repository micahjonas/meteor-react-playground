import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";

const testUsers = [
  { username: "test1", password: "password" },
  { username: "test2", password: "password" },
];

Meteor.startup(async () => {
    await Promise.all(
      testUsers.map(({ username, password }) => {
        if (Accounts.findUserByUsername(username)) {
          return;
        }
        return Accounts.createUserAsync({
          username,
          password,
        });
      })
    );
  }

  // // We publish the entire Links collection to all clients.
  // // In order to be fetched in real-time to the clients
  // Meteor.publish("links", function () {
  //   return LinksCollection.find();
  // });
});
