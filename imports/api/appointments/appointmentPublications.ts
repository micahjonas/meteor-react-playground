import { Meteor } from "meteor/meteor";
import { AppointmentsCollection } from "/imports/db/AppointmentsCollection";

Meteor.publish("appointments", function publishAppointments() {
  if (!this.userId) {
    return [];
  }

  return AppointmentsCollection.find({ userId: this.userId });
});
