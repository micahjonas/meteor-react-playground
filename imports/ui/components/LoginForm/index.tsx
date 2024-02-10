import React from "react";
import { Meteor } from "meteor/meteor";
import { useLocation } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import loginSchema, { LoginFormData } from "./loginSchema";
import { Button } from "../Button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../Form";
import { Input } from "../Input";

export const LoginForm = () => {
  const user = useTracker(() => Meteor.user());
  const location = useLocation();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    Meteor.loginWithPassword(data.username, data.password, (error) => {
      // just to demo a possible error handing
      // handling logins errors this way enables a malicious actor to determine if a username exists
      // also could be made prettier with better type guards
      if (error) {
        if (error.message === "User not found [403]") {
          return form.setError("username", {
            type: "manual",
            message: "User not found",
          });
        } else if (error.message === "Incorrect password [403]") {
          return form.setError("password", {
            type: "manual",
            message: "Incorrect password",
          });
        } else {
          // would maybe use some toast or something here to handle network isses & co
          alert("Something went wrong");
        }
      }
    });
  };

  if (user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Login</Button>
      </form>
    </Form>
  );
};

export default LoginForm;
