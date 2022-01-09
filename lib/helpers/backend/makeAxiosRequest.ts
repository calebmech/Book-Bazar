import { AxiosRequestConfig } from "axios";
import { StatusCodes } from "http-status-codes";
import axios from "axios";

export async function makeAxiosRequest(
  endpoint: string,
  options?: AxiosRequestConfig,
  milliInterval?: number,
  maxRetry?: number
) {
  maxRetry = maxRetry || 5;
  milliInterval = milliInterval || 1000;
  options = options || {};
  async function getData(maxRetry: number) {
    return await axios
      .get(endpoint, options)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        if (
          (maxRetry !== 1 &&
            error.response.status >= StatusCodes.INTERNAL_SERVER_ERROR) ||
          error?.response?.status === StatusCodes.TOO_MANY_REQUESTS
        ) {
          setTimeout(function () {
            getData(--maxRetry);
          }, milliInterval);
        }
        return null;
      });
  }
  return getData(maxRetry);
}
