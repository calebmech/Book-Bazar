import { StatusCodes } from "http-status-codes";

export async function makeFetchRequest(endpoint : string, returnType : string, options? : Object, milliInterval? : number, maxRetry? : number) : Promise<Object | string | null> {
  maxRetry = maxRetry || 5;
  milliInterval = milliInterval || 1000;
  options = options || {};
  return new Promise(function (resolve, reject) {
    function fetchData(maxRetry : number) {
      fetch(endpoint, options).then(function (res) {
        if (res.status === StatusCodes.OK) {
          if (returnType == 'JSON') {
            res.json().then(json => resolve(json)).catch(() => resolve(null));
          } else {
            res.text().then(text => resolve(text)).catch(() => resolve(null));
          }
        } else if (maxRetry !== 1 && (res.status >= StatusCodes.INTERNAL_SERVER_ERROR || res.status === StatusCodes.TOO_MANY_REQUESTS)) {
          setTimeout(function () {
            fetchData(--maxRetry);
          }, milliInterval);
        } else {
          reject(res);
        }
      }).catch(function (e) {
        reject(e);
      });
    }
    fetchData(maxRetry!);
  });
}