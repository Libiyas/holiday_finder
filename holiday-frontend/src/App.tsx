import React, { useState, useEffect } from "react";
import { Calendar, X, MapPin, Globe, Tag, Info } from "lucide-react";
import { getHolidays, searchHolidays } from "./utils/api.ts";
import SearchForm, { SearchParams } from "./components/SearchForm.tsx";
import Footer from "./components/Footer.tsx";
import Navbar from "./components/NavBar.tsx";

// Type definitions
interface DateObject {
  year: number;
  month: number;
  day: number;
}

interface HolidayDate {
  datetime: DateObject;
  iso: string;
}

interface Holiday {
  name: string;
  description?: string;
  date: HolidayDate;
  type: string[];
  locations?: string;
  states?: string;
}

// Main App Component
const App: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    country: "US",
    year: new Date().getFullYear().toString(),
    month: "",
    searchQuery: "",
  });

  useEffect(() => {
    const fetchHolidays = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let data;
        if (searchParams.searchQuery) {
          data = await searchHolidays(
            searchParams.country,
            searchParams.year,
            searchParams.searchQuery
          );
        } else {
          data = await getHolidays(
            searchParams.country,
            searchParams.year,
            searchParams.month
          );
        }
        setHolidays(data);
      } catch (err) {
        setError("Failed to fetch holidays. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHolidays();
  }, [searchParams]);

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
  };

  // Format the date from the API response
  const formatDate = (dateObj: HolidayDate): string => {
    const { year, month, day } = dateObj.datetime;
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen w-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex-1 w-full">
        <SearchForm onSearch={handleSearch} />

        {/* Holiday List Section */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 mb-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
          </div>
        ) : !holidays || holidays.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">
              No holidays found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try changing your search criteria or select a different
              country/year.
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-indigo-500" />
              Holidays ({holidays.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            </div>

            {selectedHoliday && (
              <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {selectedHoliday.name}
                      </h2>
                      <button
                        onClick={() => setSelectedHoliday(null)}
                        className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-indigo-500 mt-0.5 mr-2" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Date
                          </h3>
                          <p className="mt-1 text-sm text-gray-900 dark:text-gray-200">
                            {formatDate(selectedHoliday.date)}
                          </p>
                        </div>
                      </div>

                      {selectedHoliday.description && (
                        <div className="flex items-start">
                          <Info className="h-5 w-5 text-indigo-500 mt-0.5 mr-2" />
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Description
                            </h3>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-200">
                              {selectedHoliday.description}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start">
                        <Tag className="h-5 w-5 text-indigo-500 mt-0.5 mr-2" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Type
                          </h3>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {selectedHoliday.type.map((type, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full"
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {selectedHoliday.locations && (
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-indigo-500 mt-0.5 mr-2" />
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Locations
                            </h3>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-200">
                              {selectedHoliday.locations}
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedHoliday.states && (
                        <div className="flex items-start">
                          <Globe className="h-5 w-5 text-indigo-500 mt-0.5 mr-2" />
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              States
                            </h3>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-200">
                              {Array.isArray(selectedHoliday.states)
                                ? selectedHoliday.states
                                    .map(
                                      (state: {
                                        abbrev: string;
                                        name: string;
                                      }) => `${state.abbrev} - ${state.name}`
                                    )
                                    .join(", ")
                                : selectedHoliday.states}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
