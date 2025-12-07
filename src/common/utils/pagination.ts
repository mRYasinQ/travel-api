import type { MySqlSelect } from 'drizzle-orm/mysql-core';
import type { Request } from 'express';

import type { PaginationQuery } from '../validations/pagination';

interface Pagination {
  page: number;
  pages: number;
  next_page: number | null;
  prev_page: number | null;
  limit: number;
  total: number;
}

type PaginationData = {
  page: number;
  limit: number;
};

const { MAX_LIMIT_PAGINATION } = process.env;
const maxLimit = Number(MAX_LIMIT_PAGINATION);

const withPagination = <T extends MySqlSelect>(query: T, page: number, pageSize: number) => {
  const offset = (page - 1) * pageSize;
  const dataQuery = query.limit(pageSize).offset(offset);
  return dataQuery;
};

const getPaginationData = (req: Request): PaginationData => {
  const { page, limit = maxLimit } = req.validatedQuery as PaginationQuery;

  return {
    page: page ?? 1,
    limit: limit > maxLimit ? maxLimit : limit,
  };
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

export { withPagination, getPaginationData, createPaginationService, Pagination, PaginationData };
