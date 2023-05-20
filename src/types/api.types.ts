export type TPagination = {
  page: number;
  limit: number;
  total_pages: number;
  total_items: number;
}

export type TPaginationResponse<T> = {
  data: T[];
  pagination: TPagination;
}

export type TSuccessResponse<T> = {
  data: T;
}

export type TErrorDetail = {
  field?: string;
  message: string;
}

export type TErrorResponse = {
  error: {
    message: string;
    details: TErrorDetail[];
  }
}