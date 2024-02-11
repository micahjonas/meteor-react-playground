export interface AppointmentForCreate {
  userId: string;
  date: Date;
  firstName: string;
  lastName: string;
  allDay: boolean;
}

export interface Appointment extends AppointmentForCreate {
  _id: string;
}
