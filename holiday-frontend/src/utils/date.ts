import { HolidayDate } from "../App";

// Format the date from the API response
export const formatDate = (dateObj: HolidayDate): string => {
  const { year, month, day } = dateObj.datetime;
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
