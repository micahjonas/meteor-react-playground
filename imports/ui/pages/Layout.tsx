import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";

export const Layout = () => {
  return (
    <div className="h-screen overflow-hidden flex flex-col bg-slate-100">
      <Header />
      <Outlet />
    </div>
  );
};
