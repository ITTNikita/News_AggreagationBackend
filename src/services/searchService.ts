import { SearchRepository } from '../repositories/searchRepository';
const searchRepo = new SearchRepository();

export class SearchService {
  search(query: string, from?: string, to?: string) {
    return searchRepo.fullTextSearch(query, from, to);
  }
}