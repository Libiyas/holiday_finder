// Search Form Component
import React, { useCallback, useState } from "react";
import { Search } from "lucide-react";

export interface SearchParams {
  country: string;
  year: string;
  month: string;
  day: string;
  holidayType: string;
  searchQuery: string;
}

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
}

interface MonthOption {
  value: string;
  label: string;
}

interface CountryOption {
  code: string;
  name: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const CURRENT_YEAR = new Date().getFullYear();
  const YEARS: number[] = Array.from(
    { length: 10 },
    (_, i) => CURRENT_YEAR - 5 + i
  );
  const MONTHS: MonthOption[] = [
    { value: "", label: "All Months" },
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // Generate days 1-31 plus "All Days" option
  const DAYS: { value: string; label: string }[] = [
    { value: "", label: "All Days" },
    ...Array.from({ length: 31 }, (_, i) => ({
      value: (i + 1).toString(),
      label: (i + 1).toString(),
    })),
  ];

  const COUNTRIES: CountryOption[] = [
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "JP", name: "Japan" },
    { code: "CN", name: "China" },
    { code: "IN", name: "India" },
    { code: "BR", name: "Brazil" },
  ];

  const HOLIDAY_TYPES = [
    "All Types",
    "national",
    "local",
    "religious",
    "observance",
  ];

  const [country, setCountry] = useState<string>("US");
  const [year, setYear] = useState<string>(CURRENT_YEAR.toString());
  const [month, setMonth] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [holidayType, setHolidayType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params: SearchParams = {
      country,
      year,
      month,
      day,
      holidayType: holidayType === "All Types" ? "" : holidayType,
      searchQuery,
    };
    onSearch(params);
  };

  // Function to get the maximum number of days for the selected month and year
  const getMaxDaysInMonth = useCallback((): number => {
    if (!month) return 31; // Default to 31 when "All Months" is selected

    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    // For February, check if it's a leap year
    if (monthNum === 2) {
      if ((yearNum % 4 === 0 && yearNum % 100 !== 0) || yearNum % 400 === 0) {
        return 29; // Leap year
      } else {
        return 28; // Non-leap year
      }
    }

    // For months with 30 days
    if ([4, 6, 9, 11].includes(monthNum)) {
      return 30;
    }

    // All other months have 31 days
    return 31;
  }, [month, year]);

  // Filter the days based on the selected month and year
  const filteredDays = DAYS.filter((dayOption) => {
    if (dayOption.value === "") return true; // Always keep "All Days" option

    const dayNum = parseInt(dayOption.value);
    return dayNum <= getMaxDaysInMonth();
  });

  // Reset day selection if it's invalid for the new month/year
  React.useEffect(() => {
    const maxDays = getMaxDaysInMonth();
    if (day && parseInt(day) > maxDays) {
      setDay("");
    }
  }, [day, getMaxDaysInMonth, month, year]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center text-gray-900 dark:text-white">
          <Search className="mr-2 h-5 w-5 text-indigo-500" />
          Search Holidays
        </h2>
      </div>

      <form onSubmit={handleSubmit} className={`hidden sm:block`}>
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 lg:grid-cols-6">
          {/* Country Select */}
          <div className="sm:col-span-1 lg:col-span-1">
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Country
            </label>
            <select
              id="country"
              name="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg transition duration-150"
            >
              {COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Year Select */}
          <div className="sm:col-span-1 lg:col-span-1">
            <label
              htmlFor="year"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Year
            </label>
            <select
              id="year"
              name="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg transition duration-150"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Month Select */}
          <div className="sm:col-span-1 lg:col-span-1">
            <label
              htmlFor="month"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Month
            </label>
            <select
              id="month"
              name="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg transition duration-150"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Day Select - New Addition */}
          <div className="sm:col-span-1 lg:col-span-1">
            <label
              htmlFor="day"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Day
            </label>
            <select
              id="day"
              name="day"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg transition duration-150"
            >
              {filteredDays.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* Holiday type Select */}
          <div className="sm:col-span-1 lg:col-span-1">
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Type
            </label>
            <select
              id="type"
              name="type"
              value={holidayType}
              onChange={(e) => setHolidayType(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg transition duration-150"
            >
              {HOLIDAY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Search by Name
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg transition duration-150"
                placeholder="e.g. Christmas, New Year..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-6 flex items-end">
            <button
              type="submit"
              className="w-full inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
            >
              <Search className="mr-2 h-4 w-4" />
              Search Holidays
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
