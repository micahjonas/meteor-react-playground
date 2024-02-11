import React from "react";
import { Appointment } from "/imports/api/appointments/appointment.model";
import { AppointmentItem } from "./AppointmentItem";

export const AppointmentList = ({
  appointments,
}: {
  appointments: Appointment[];
}) => {
  return (
    <div className="flex flex-col gap-2">
      {appointments.map((appointment) => (
        <AppointmentItem key={appointment._id} appointment={appointment} />
      ))}
    </div>
  );
};
