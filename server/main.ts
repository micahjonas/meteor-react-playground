import { Meteor } from "meteor/meteor";
import { AppointmentsCollection } from "/imports/db/AppointmentsCollection";
import {
  generateSeedAppointments,
  insertAppointment,
} from "/imports/api/appointments/appointmentSeeder";
import { Accounts } from "meteor/accounts-base";
import "/imports/api/appointments/appointmentPublications";
import "/imports/api/appointments/appointmentMethods";

const testUsers = [
  { username: "test1", password: "password" },
  { username: "test2", password: "password" },
];

Meteor.startup(async () => {
  console.log("Meteor startup");
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

  const numberOfAppointments = await AppointmentsCollection.find().countAsync();
  if (numberOfAppointments === 0) {
    console.log("No appointments found, seeding appointments");
    for await (const testUser of testUsers) {
      const user = Accounts.findUserByUsername(testUser.username);
      if (!user) {
        throw new Error(`User ${testUser.username} not found for data seeding`);
      }
      const appointmentSeeds = generateSeedAppointments(user);

      // in production code we should limit the number of concurrent inserts
      // with somethibng like p-limit but for this example it should be fine
      await Promise.all(
        appointmentSeeds.map((appointment) => insertAppointment(appointment))
      );
      console.log("Seeding appointments done");
    }
  }
});
