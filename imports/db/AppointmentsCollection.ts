import { Mongo } from "meteor/mongo";
import { type Appointment } from "../api/appointments/appointment.model";

export const AppointmentsCollection = new Mongo.Collection<Appointment>(
  "appointments"
);
