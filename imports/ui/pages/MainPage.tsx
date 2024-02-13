import React from "react";
import { Meteor } from "meteor/meteor";
import { useSearchParams } from "react-router-dom";
import { startOfDay } from "date-fns";
import { AppointmentsCollection } from "/imports/db/AppointmentsCollection";
import { Appointment } from "/imports/api/appointments/appointment.model";
// @ts-ignore
import { useTracker } from "meteor/react-meteor-data";
import { WidgetA } from "../components/WidgetA";
import { WidgetB } from "../components/WidgetB";

export const MainPage = () => {
  const [searchParams] = useSearchParams();
  const selected = searchParams.get("selected");
  const search = searchParams.get("search");

  const { appointments, isLoading } = useTracker(() => {
    const handler = Meteor.subscribe("appointments");

    if (!handler.ready()) {
      return { appointments: [], isLoading: true };
    }

    const hidePastAppointments = { date: { $gte: startOfDay(new Date()) } };
    const filter = {
      $or: [
        { firstName: { $regex: `^${search}`, $options: "i" } },
        { lastName: { $regex: `^${search}`, $options: "i" } },
      ],
    };
    const query = search
      ? { ...hidePastAppointments, ...filter }
      : hidePastAppointments;
    const appointments = AppointmentsCollection.find(query, {
      sort: { date: 1 },
    }).fetch();

    return { appointments };
  }) as {
    appointments: Array<Appointment>;
    isLoading: boolean;
  };

  const selectedAppointment =
    selected &&
    appointments.find((appointment) => appointment._id === selected);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex p-4 gap-4 overflow-hidden">
      <WidgetA
        className="grow"
        appointment={selectedAppointment ? selectedAppointment : undefined}
      />
      <WidgetB appointments={appointments} />
    </div>
  );
};
