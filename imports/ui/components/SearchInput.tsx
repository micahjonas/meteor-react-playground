import React, { ChangeEventHandler } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "./Input";
import { Label } from "./Label";

export const SearchInput = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearchParams({ search: event.target.value });
  };

  return (
    <div>
      <Label htmlFor="search">Search</Label>
      <Input
        id="search"
        value={searchParams.get("search") || ""}
        onChange={handleChange}
        type="text"
        placeholder="Search..."
        className="border border-gray-300 rounded-md p-2"
      />
    </div>
  );
};
