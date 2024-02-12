import React, { ComponentPropsWithoutRef, FC } from "react";
import { Appointment } from "/imports/api/appointments/appointment.model";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { AppointmentForm } from "./AppointmentForm";

interface WidgetBProps extends ComponentPropsWithoutRef<typeof Card> {
  appointment?: Appointment;
}

export const WidgetB: FC<WidgetBProps> = ({ appointment, ...restProps }) => {
  return (
    <Card {...restProps}>
      <CardHeader>
        <CardTitle>
          {appointment ? "Edit appointment" : "Create appointment"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AppointmentForm appointment={appointment} key={appointment?._id} />
      </CardContent>
    </Card>
  );
};
