import z from "zod";
import { addDays } from "date-fns";

export const createAppointmentSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "Firstname must be at least 3 characters" }),
  lastName: z
    .string()
    .min(3, { message: "Lastname must be at least 3 characters" }),
  date: z.date().min(addDays(new Date(), -1), { message: "Too old" }),
  allDay: z.boolean().optional(),
});

export type CreateAppointment = z.infer<typeof createAppointmentSchema>;

export interface AppointmentForSeed extends CreateAppointment {
  userId: string;
}

export interface Appointment extends AppointmentForSeed {
  _id: string;
}
