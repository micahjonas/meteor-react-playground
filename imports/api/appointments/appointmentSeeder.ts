import { fakerDE as faker } from "@faker-js/faker";
import { Meteor } from "meteor/meteor";
import { addMonths } from "date-fns";
import { AppointmentForCreate } from "./appointment.model";
import { AppointmentsCollection } from "/imports/db/AppointmentsCollection";

function generateRandomDate(): Date {
  const today = new Date();
  const aMonthFromNow = addMonths(today, 1);
  return new Date(
    today.getTime() +
      Math.random() * (aMonthFromNow.getTime() - today.getTime())
  );
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

function generateUniqueRandomDate(numberOfDates: number): Date[] {
  const dates: Date[] = [];

  while (dates.length < numberOfDates) {
    const date = generateRandomDate();
    if (!dates.some((d) => isSameDay(d, date))) {
      dates.push(date);
    }
  }

  return dates;
}

export function generateSeedAppointments(user: Meteor.User) {
  // reserve 5 days for all-day appointments
  const allDayAppointments = generateUniqueRandomDate(5);
  const appointments: AppointmentForCreate[] = [];

  while (appointments.length < 15) {
    const date = generateRandomDate();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    if (!allDayAppointments.some((d) => isSameDay(d, date))) {
      appointments.push({
        date,
        allDay: false,
        firstName,
        lastName,
        userId: user._id,
      });
    }
  }

  for (const date of allDayAppointments) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    appointments.push({
      date,
      allDay: true,
      firstName,
      lastName,
      userId: user._id,
    });
  }

  return appointments;
}

export async function insertAppointment(
  appointment: AppointmentForCreate
): Promise<string> {
  return AppointmentsCollection.insertAsync(appointment);
}
