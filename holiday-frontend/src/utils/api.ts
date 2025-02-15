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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getHolidays = async (
  country: string,
  year: string,
  month: string | null = null
): Promise<Holiday[]> => {
  try {
    let url = `${API_BASE_URL}/holidays/?country=${country}&year=${year}`;
    if (month) {
      url += `&month=${month}`;
    }
    const response = await axios.get<Holiday[]>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching holidays:", error);
    throw error;
  }
};

export const searchHolidays = async (
  country: string,
  year: string,
  query: string
): Promise<Holiday[]> => {
  try {
    const url = `${API_BASE_URL}/holidays/search/?country=${country}&year=${year}&query=${query}`;
    const response = await axios.get<Holiday[]>(url);
    return response.data;
  } catch (error) {
    console.error("Error searching holidays:", error);
    throw error;
  }
};
