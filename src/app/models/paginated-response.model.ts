export interface PaginatedResponse<T> {
  data: T[];
  startFrom: number;
  pageSize: number;
  lastPage?: boolean;
}
