import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Search } from './search';
import { Book } from './book';
import { Page } from './page';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MainService {

  public books: Book[];
  public page: Page;

  constructor(private http: HttpClient) {
    this.page = new Page(0, 6, 6, 6);
  }

    search(params) {

      return this.http.get('../assets/dummyData.json');

      // let url = 'http://local.rathe.com/search.php';
      // return this.http.post(url, params);

    }

    setBooks(data) {
      this.books = data;
    }

    getBooks() {
      return this.books;
    }

    setPage(start, perpage, total) {
      this.page.currentStart = start;
      this.page.numPerPage = perpage;
      this.page.totalItems = total;
      this.page.maxStart = Math.floor(total / perpage ) * perpage;
    }

    getPage() {
      return this.page;
    }
}
