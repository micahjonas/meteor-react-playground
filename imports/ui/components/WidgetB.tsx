import React from "react";
import { Appointment } from "/imports/api/appointments/appointment.model";
import { AppointmentItem } from "./AppointmentItem";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { SearchInput } from "./SearchInput";

export const WidgetB = ({ appointments }: { appointments: Appointment[] }) => {
  return (
    <Card className="max-h-full flex flex-col">
      <CardHeader>
        <CardTitle>Appointments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 overflow-hidden grow shrink flex flex-col">
        <SearchInput />

        <div className="flex flex-col gap-2 overflow-auto">
          {appointments.map((appointment) => (
            <AppointmentItem key={appointment._id} appointment={appointment} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
