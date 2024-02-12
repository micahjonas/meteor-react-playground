import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import {
  type CreateAppointment,
  createAppointmentSchema,
} from "./appointment.model";
import { AppointmentsCollection } from "../../db/AppointmentsCollection";

Meteor.methods({
  async "appointments.insert"(appointment: CreateAppointment) {
    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    const validatedData = createAppointmentSchema.safeParse(appointment);
    if (!validatedData.success) {
      throw new Meteor.Error(
        "Validation error",
        JSON.stringify(validatedData.error)
      );
    }

    return AppointmentsCollection.insertAsync({
      ...validatedData.data,
      userId: this.userId,
    });
  },

  async "appointments.update"(id: string, appointment: CreateAppointment) {
    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    check(id, String);

    const hasAccess = await AppointmentsCollection.findOneAsync({
      _id: id,
      userId: this.userId,
    });

    if (!hasAccess) {
      throw new Meteor.Error("Access denied.");
    }

    const validatedData = createAppointmentSchema.safeParse(appointment);
    if (!validatedData.success) {
      throw new Meteor.Error(
        "Validation error",
        JSON.stringify(validatedData.error)
      );
    }

    return AppointmentsCollection.updateAsync(id, {
      $set: {
        ...appointment,
      },
    });
  },

  // "tasks.remove"(taskId) {
  //   check(taskId, String);

  //   if (!this.userId) {
  //     throw new Meteor.Error("Not authorized.");
  //   }

  //   const task = TasksCollection.findOne({ _id: taskId, userId: this.userId });

  //   if (!task) {
  //     throw new Meteor.Error("Access denied.");
  //   }

  //   TasksCollection.remove(taskId);
  // },

  // "tasks.setIsChecked"(taskId, isChecked) {
  //   check(taskId, String);
  //   check(isChecked, Boolean);

  //   if (!this.userId) {
  //     throw new Meteor.Error("Not authorized.");
  //   }

  //   const task = TasksCollection.findOne({ _id: taskId, userId: this.userId });

  //   if (!task) {
  //     throw new Meteor.Error("Access denied.");
  //   }

  //   TasksCollection.update(taskId, {
  //     $set: {
  //       isChecked,
  //     },
  //   });
  // },
});
