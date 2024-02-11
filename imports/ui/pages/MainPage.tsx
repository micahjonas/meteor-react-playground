import React from "react";
import { Meteor } from "meteor/meteor";
import { useSearchParams } from "react-router-dom";
import { AppointmentsCollection } from "/imports/db/AppointmentsCollection";
import { Appointment } from "/imports/api/appointments/appointment.model";
import { useTracker } from "meteor/react-meteor-data";
import { WidgetB } from "../components/WidgetB";
import { AppointmentList } from "../components/AppointmentList";

export const MainPage = () => {
  const [searchParams] = useSearchParams();
  const selected = searchParams.get("selected");

  const { appointments, isLoading } = useTracker(() => {
    const handler = Meteor.subscribe("appointments");

    if (!handler.ready()) {
      return { appointments: [], isLoading: true };
    }

    const appointments = AppointmentsCollection.find(
      {},
      { sort: { date: 1 } }
    ).fetch();

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

  console.log("selected", selectedAppointment);

  return (
    <div className="flex p-4 gap-4">
      <AppointmentList appointments={appointments} />
      <WidgetB
        className="grow"
        appointment={selectedAppointment ? selectedAppointment : undefined}
      />
    </div>
  );
};
