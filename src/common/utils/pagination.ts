import type { MySqlSelect } from 'drizzle-orm/mysql-core';

interface Pagination {
  page: number;
  pages: number;
  next_page: Nullable<number>;
  prev_page: Nullable<number>;
  limit: number;
  total: number;
}

const withPagination = <T extends MySqlSelect>(query: T, page: number, pageSize: number) => {
  const offset = (page - 1) * pageSize;
  const dataQuery = query.limit(pageSize).offset(offset);
  return dataQuery;
};

const createPaginationService = (page: number, limit: number, total: number): Pagination => {
  const pages = Math.ceil(total / limit);
  const nextPage = page < pages ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;

  return {
    page,
    pages,
    next_page: nextPage,
    prev_page: prevPage,
    limit,
    total,
  };
};

export { withPagination, createPaginationService, Pagination };
