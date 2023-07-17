let API_SERVER_URL = "https://vm.kyros.ai:23456/api";
if (process.env.REACT_APP_API_SERVER) {
  API_SERVER_URL = process.env.REACT_APP_API_SERVER;
}
export const BASE_URL = API_SERVER_URL;

let SERVER_URL = "https://vm.kyros.ai:23456/";
if (process.env.NODE_ENV === 'production') {
  SERVER_URL = "https://www.kyros.ai/";
}

let CSA_SERVER_URL = "https://vcsa.kyros.ai:23456/";
if (process.env.NODE_ENV === 'production') {
  CSA_SERVER_URL = "https://csa-program.kyros.ai/";
}
export const CSA_URL = CSA_SERVER_URL;

// The following code is not intended for a security measurement. We use it to
// keep casual probers away. We use firebase authentication and verification in
// our backend for improved security.
let NOT_SECRET_INPUT = "cKtm2OaBcmhyo8ygS38r3kwdc";
if (process.env.REACT_APP_NOT_SECRET) {
  NOT_SECRET_INPUT = process.env.REACT_APP_NOT_SECRET;
}
export const NOT_SECRET = NOT_SECRET_INPUT;

export { SERVER_URL };
