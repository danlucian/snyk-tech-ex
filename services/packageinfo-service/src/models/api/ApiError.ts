export default interface ApiError {
  statusCode: number;
  error: string;
  message: string;
}

export const noDependenciesFound = (
  message: string = "No depedencies were found!"
) => {
  return { statusCode: 404, error: "Data error", message: message };
};
