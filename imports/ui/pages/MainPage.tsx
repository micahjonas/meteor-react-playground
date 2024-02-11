import React from "react";
import { Meteor } from "meteor/meteor";
import { AppointmentsCollection } from "/imports/db/AppointmentsCollection";
import { Appointment } from "/imports/api/appointments/appointment.model";
import { useTracker } from "meteor/react-meteor-data";
import { Card } from "../components/Card";

const DisplayDate = ({ date }: { date: Date }) => {
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
};

export const MainPage = () => {
  // not sure this is necessary we should never get here if the user is not logged in
  const user = useTracker(() => Meteor.user());

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
    appointments: Array<Appointment & { _id: string }>;
    isLoading: boolean;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      <Card>
        <h1 className="text-red-600">Welcome to MainPage!</h1>

        <div>
          {appointments.map((appointment) => (
            <div key={appointment._id} className="p-4">
              <h2>
                {appointment.firstName} {appointment.lastName}
              </h2>

              <p>
                <DisplayDate date={appointment.date} />
              </p>

              <p>{appointment.allDay ? "All day" : "Not all day"}</p>

              <p>
                {appointment.userId === user?._id
                  ? "Your appointment"
                  : "FAILLLL"}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
