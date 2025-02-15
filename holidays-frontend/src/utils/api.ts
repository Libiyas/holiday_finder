import axios from "axios";

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

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getHolidays = async (
  country: string,
  year: string,
  month: string | null = null,
  day: string | null = null,
  holidayType: string | null = null,
  currentPage: number = 1
): Promise<PaginatedResponse<Holiday>> => {
  try {
    const params: Record<string, string | number> = {
      country,
      year,
      page: currentPage,
    };
    if (month) params.month = month;
    if (day) params.day = day;
    if (holidayType) params.type = holidayType;

    const response = await axios.get<PaginatedResponse<Holiday>>(
      `${API_BASE_URL}/holidays/`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching holidays:", error);
    throw error;
  }
};

export const searchHolidays = async (
  country: string,
  year: string,
  query: string,
  currentPage: number = 1
): Promise<PaginatedResponse<Holiday>> => {
  try {
    const params = {
      country,
      year,
      query,
      page: currentPage,
    };

    const response = await axios.get<PaginatedResponse<Holiday>>(
      `${API_BASE_URL}/holidays/search`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error searching holidays:", error);
    throw error;
  }
};
