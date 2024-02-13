import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { startOfDay, endOfDay } from "date-fns";
import {
  type CreateAppointment,
  createAppointmentSchema,
} from "./appointment.model";
import { AppointmentsCollection } from "../../db/AppointmentsCollection";

interface AllDayValidationQuery {
  userId: string;
  date: {
    $gte: Date;
    $lte: Date;
  };
  allDay?: boolean;
  _id?: { $ne: string };
}

async function checkAllDayAppointments({
  userId,
  date,
  allDay,
  id,
}: {
  userId: string;
  date: Date;
  allDay?: boolean;
  id?: string;
}) {
  const allDayValidationQuery: AllDayValidationQuery = {
    userId,
    date: {
      $gte: startOfDay(date),
      $lte: endOfDay(date),
    },
  };
  if (id) {
    allDayValidationQuery._id = { $ne: id };
  }
  if (!allDay) {
    allDayValidationQuery.allDay = true;
  }

  const allDayBlockers = await AppointmentsCollection.find(
    allDayValidationQuery
  ).fetchAsync();
  if (allDayBlockers.length > 0) {
    throw new Meteor.Error(
      allDay
        ? "Aleardy booked other meetings on this date"
        : "This date is already fully booked"
    );
  }
}

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

    await checkAllDayAppointments({
      userId: this.userId,
      date: validatedData.data.date,
      allDay: validatedData.data.allDay,
    });

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
    await checkAllDayAppointments({
      userId: this.userId,
      date: validatedData.data.date,
      allDay: validatedData.data.allDay,
      id,
    });

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
