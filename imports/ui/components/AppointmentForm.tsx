import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format } from "date-fns";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./Form";
import { Input } from "./Input";
import { Button } from "./Button";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Checkbox } from "./Checkbox";
import { Appointment } from "/imports/api/appointments/appointment.model";
import { z } from "zod";
import { cn } from "./utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./Calendar";
import { Meteor } from "meteor/meteor";
import { startOfDay, endOfDay } from "date-fns";
import { useSearchParams } from "react-router-dom";
// @ts-ignore
import { useSubscribe } from "meteor/react-meteor-data";
import { AppointmentsCollection } from "/imports/db/AppointmentsCollection";

const appointmentSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "Firstname must be at least 3 characters" }),
  lastName: z
    .string()
    .min(3, { message: "Lastname must be at least 3 characters" }),
  date: z.date().min(addDays(new Date(), -1), { message: "Too old" }),
  allDay: z.boolean().optional(),
});

interface AllDayValidationQueryClient {
  date: {
    $gte: Date;
    $lte: Date;
  };
  allDay?: boolean;
  _id?: { $ne: string };
}

export type AppointmentFormData = z.infer<typeof appointmentSchema>;

export const AppointmentForm = ({
  appointment,
}: {
  appointment?: Appointment;
}) => {
  const [_, setSearchParams] = useSearchParams();

  // technically we already have a subscription in a parent component
  // but in case this component is used in isolation we need to subscribe
  // to the appointments publication
  const loading = useSubscribe("appointments");

  const defaultValues = {
    firstName: appointment?.firstName ?? "",
    lastName: appointment?.lastName ?? "",
    date: appointment?.date ?? new Date(),
    allDay: appointment?.allDay ?? false,
  };

  const form = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<AppointmentFormData> = async (formData) => {
    // duplicated code between client and server
    // is there a better way to handle this?
    const allDayValidationQuery: AllDayValidationQueryClient = {
      date: {
        $gte: startOfDay(formData.date),
        $lte: endOfDay(formData.date),
      },
    };
    if (appointment?._id) {
      allDayValidationQuery._id = { $ne: appointment?._id };
    }
    if (!formData.allDay) {
      allDayValidationQuery.allDay = true;
    }

    const allDayBlockers = await AppointmentsCollection.find(
      allDayValidationQuery
    ).fetchAsync();
    if (allDayBlockers.length > 0) {
      if (formData.allDay) {
        form.setError("allDay", {
          message: "Already booked other appointments on this date",
        });
      } else {
        form.setError("date", {
          message: "This date is already fully booked",
        });
      }
      return;
    }

    if (appointment) {
      Meteor.call("appointments.update", appointment._id, formData);
      return;
    } else {
      Meteor.call("appointments.insert", formData);
      if (!appointment) {
        form.reset();
      }
    }
  };

  if (loading()) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Firstname</FormLabel>
                <FormControl>
                  <Input {...field} autoFocus />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lastname</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <div className="w-fukk">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < addDays(new Date(), -1)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allDay"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0 py-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>All day</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4">
          <Button type="submit" disabled={!form.formState.isDirty}>
            Save
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSearchParams({ selected: "" });
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};
