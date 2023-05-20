import { TErrorDetail, TErrorResponse } from "../types/api.types";

export const constructErrorRersponse = (message: string, details: TErrorDetail[]): TErrorResponse => ({
  error: {
    message,
    details
  }
});

export const constructErrorValidationResponse = (details: TErrorDetail[]): TErrorResponse => {
  const message = "Validation Error";
  return constructErrorRersponse(message, details);
}
export const constructErrorDuplicateResponse = (errors: TErrorDetail[]): TErrorResponse => {
  const message = "Duplicate Error";
  return constructErrorRersponse(message, errors);
}
export const constructErrorNotFoundResponse = (errors: TErrorDetail[]): TErrorResponse => {
  const message = "Not Found Error";
  return constructErrorRersponse(message, errors);
}
export const constructErrorInternalServerResponse = (errors: TErrorDetail[]): TErrorResponse => {
  const message = "Internal Server Error";
  return constructErrorRersponse(message, errors);
}
export const constructErrorUnauthorizedResponse = (errors: TErrorDetail[]): TErrorResponse => {
  const message = "Unauthorized Error";
  return constructErrorRersponse(message, errors);
}
export const constructErrorForbiddenResponse = (errors: TErrorDetail[]): TErrorResponse => {
  const message = "Forbidden Error";
  return constructErrorRersponse(message, errors);
}