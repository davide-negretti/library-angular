export interface Pagination {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}
