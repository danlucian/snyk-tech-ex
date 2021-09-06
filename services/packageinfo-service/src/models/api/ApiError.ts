export default interface ApiError {
  statusCode: number;
  error: string;
  message: string;
}

export const genericError = (message: string = "An unknown error occured") => {
  return { statusCode: 500, error: "Generic error", message: message };
};
