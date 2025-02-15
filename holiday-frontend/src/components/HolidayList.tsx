import React from "react";
import { formatDate } from "../utils/date";
import { Holiday } from "../App";

export const HolidayList: React.FC<{
  holidays: Holiday[];
  setSelectedHoliday: (holiday: Holiday) => void;
}> = ({ holidays, setSelectedHoliday }) => {
  return (
    <>
      {holidays.map((holiday, index) => (
        <div
          key={`${holiday.name}-${index}`}
          className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
          onClick={() => setSelectedHoliday(holiday)}
        >
          <div className="p-5">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {holiday.name}
              </h3>
              <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 text-xs px-2 py-1 rounded-full">
                {formatDate(holiday.date).split(",")[0]}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {formatDate(holiday.date)}
            </p>
            <div className="flex flex-wrap gap-1 mb-3">
              {holiday.type.map((type, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full"
                >
                  {type}
                </span>
              ))}
            </div>
            {holiday.description && (
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                {holiday.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </>
  );
};
