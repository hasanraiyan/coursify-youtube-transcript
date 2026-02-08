export default class ApiError extends Error {
  constructor(status = 500, message = "" ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
