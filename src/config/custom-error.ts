import { STATUS_CODE } from "../constants/status-code.constants";

class CustomError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = STATUS_CODE.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;

    // set the prototype explicitly to ensure proper inheritance
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export default CustomError;