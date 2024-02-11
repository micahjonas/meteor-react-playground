import React from "react";

export const Date = ({ date }: { date: Date }) => {
  return (
    <span className="text-sm text-slate-700">
      {`${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`}
    </span>
  );
};
