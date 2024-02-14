import { Meteor } from "meteor/meteor";
import { expect } from "expect";
import { AppointmentsCollection } from "../../db/AppointmentsCollection";
import "./appointmentMethods";
import { CreateAppointment } from "./appointment.model";

export const UNIT_TEST = {
  USER_ID: "ecFkNaLpNATJ8avNr",
  USERNAME: "Unit test user",
};

if (Meteor.isServer) {
  describe("Appointments methods", function () {
    beforeEach(async function () {
      await AppointmentsCollection.removeAsync({});
    });

    it("should insert new apoointment", async function () {
      const testAppointment: CreateAppointment = {
        date: new Date(),
        allDay: false,
        firstName: "John",
        lastName: "Doe",
      };
      // @ts-ignore
      const _id = await Meteor.server.method_handlers[
        "appointments.insert"
      ].apply({ userId: UNIT_TEST.USER_ID }, [testAppointment]);

      const appointment = await AppointmentsCollection.findOneAsync({ _id });
      expect(appointment).toEqual({
        ...testAppointment,
        userId: UNIT_TEST.USER_ID,
        _id,
      });
    });

    it("should not allow insert without user", async function () {
      const testAppointment: CreateAppointment = {
        date: new Date(),
        allDay: false,
        firstName: "John",
        lastName: "Doe",
      };
      await expect(async () => {
        // @ts-ignore
        await Meteor.server.method_handlers["appointments.insert"]([
          testAppointment,
        ]);
      }).rejects.toThrow("Not authorized.");
    });

    it("should serverside validate", async function () {
      const testAppointment = {
        date: new Date(),
        allDay: false,
        lastName: "Doe",
      };

      await expect(
        async () =>
          // @ts-ignore
          await Meteor.server.method_handlers["appointments.insert"].apply(
            { userId: UNIT_TEST.USER_ID },
            [testAppointment]
          )
      ).rejects.toThrow(
        JSON.stringify({
          issues: [
            {
              code: "invalid_type",
              expected: "string",
              received: "undefined",
              path: ["firstName"],
              message: "Required",
            },
          ],
          name: "ZodError",
        })
      );
    });

    it("should be able to enter two same day appointments", async function () {
      const testAppointments: CreateAppointment[] = [
        {
          date: new Date(),
          allDay: false,
          firstName: "John",
          lastName: "Doe",
        },
        {
          date: new Date(),
          allDay: false,
          firstName: "Jane",
          lastName: "Doe",
        },
      ];

      const ids = await Promise.all(
        testAppointments.map(async (testAppointment) => {
          // @ts-ignore
          return Meteor.server.method_handlers["appointments.insert"].apply(
            { userId: UNIT_TEST.USER_ID },
            [testAppointment]
          );
        })
      );

      const appointments = await AppointmentsCollection.find({
        userId: UNIT_TEST.USER_ID,
      }).fetchAsync();

      expect(appointments.length).toEqual(2);
      expect(appointments.map((a) => a._id).sort()).toEqual(ids.sort());
    });

    it("should not allow two all day appointments on the same day", async function () {
      const testAppointments: CreateAppointment[] = [
        {
          date: new Date(),
          allDay: true,
          firstName: "John",
          lastName: "Doe",
        },
        {
          date: new Date(),
          allDay: true,
          firstName: "Jane",
          lastName: "Doe",
        },
      ];

      // @ts-ignore
      await Meteor.server.method_handlers["appointments.insert"].apply(
        { userId: UNIT_TEST.USER_ID },
        [testAppointments[0]]
      );

      await expect(
        async () =>
          // @ts-ignore
          await Meteor.server.method_handlers["appointments.insert"].apply(
            { userId: UNIT_TEST.USER_ID },
            [testAppointments[1]]
          )
      ).rejects.toThrow();
    });

    it("should not allow normal appointment on the same day with all day appointment", async function () {
      const testAppointments: CreateAppointment[] = [
        {
          date: new Date(),
          allDay: true,
          firstName: "John",
          lastName: "Doe",
        },
        {
          date: new Date(),
          allDay: false,
          firstName: "Jane",
          lastName: "Doe",
        },
      ];

      // @ts-ignore
      await Meteor.server.method_handlers["appointments.insert"].apply(
        { userId: UNIT_TEST.USER_ID },
        [testAppointments[0]]
      );

      await expect(
        async () =>
          // @ts-ignore
          await Meteor.server.method_handlers["appointments.insert"].apply(
            { userId: UNIT_TEST.USER_ID },
            [testAppointments[1]]
          )
      ).rejects.toThrow("This date is already fully booked");
    });

    it("should not allow all day appointment on the same day with normal appointment", async function () {
      const testAppointments: CreateAppointment[] = [
        {
          date: new Date(),
          allDay: false,
          firstName: "John",
          lastName: "Doe",
        },
        {
          date: new Date(),
          allDay: true,
          firstName: "Jane",
          lastName: "Doe",
        },
      ];

      // @ts-ignore
      await Meteor.server.method_handlers["appointments.insert"].apply(
        { userId: UNIT_TEST.USER_ID },
        [testAppointments[0]]
      );

      await expect(
        async () =>
          // @ts-ignore
          await Meteor.server.method_handlers["appointments.insert"].apply(
            { userId: UNIT_TEST.USER_ID },
            [testAppointments[1]]
          )
      ).rejects.toThrow("Aleardy booked other meetings on this date");
    });
  });
}
