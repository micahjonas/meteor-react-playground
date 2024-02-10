import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "../components/Card";
import { LoginForm } from "../components/LoginForm";

export const LoginPage = () => {
  console.log("LoginPage");
  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};
