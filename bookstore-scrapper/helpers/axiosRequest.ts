import axios, { AxiosRequestConfig } from "axios";

export const axiosRequest = async (
  endpoint: string,
  options?: AxiosRequestConfig
) => {
  try {
    options = options || {};
    const response = await axios(endpoint, options);
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
