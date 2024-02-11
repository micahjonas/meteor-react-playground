import React from "react";
import { useSearchParams } from "react-router-dom";
import { cn } from "./utils";
import { Appointment } from "/imports/api/appointments/appointment.model";
import { Date } from "./Date";
import { Badge } from "./Badge";

export const AppointmentItem = ({
  appointment,
}: {
  appointment: Appointment;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const isActive = searchParams.get("selected") === appointment._id;

  return (
    <button
      className={cn(
        "flex flex-col gap-2 border border-slate-300 shadow-sm p-4 rounded-lg text-left transition-all bg-white hover:bg-slate-200 hover:shadow",
        {
          "bg-slate-300 border-slate-400": isActive,
        }
      )}
      onClick={() => {
        setSearchParams({ selected: appointment._id });
      }}
    >
      <h3 className="text-lg font-semibold">
        {appointment.firstName} {appointment.lastName}
      </h3>
      <div className="flex gap-2 items-center">
        {appointment.allDay && <Badge>All day</Badge>}
        <Date date={appointment.date} />
      </div>
    </button>
  );
};
