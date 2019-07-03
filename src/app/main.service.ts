import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Search } from './search';
import { Book } from './book';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MainService {

  public books: Book[];

  constructor(private http: HttpClient) {
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
}
