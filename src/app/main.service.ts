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

      // return this.http.get('../assets/dummyData3.json');

      let body = 'recent=' + params.recent + '&keywords=' + params.keywords + '&start=' + params.start + '&size=' + params.size;

      if (params.magic.length === 0) {
        body += '&magic=';
      } else {
        for (let i = 0; i < params.magic.length; i++) {
          body += '&magic%5B%5D=' + params.magic[i];
        }
      }

       let url = 'https://rathe.app/api/search.php';
       // let url = 'http://local.hockeyapi.com/api/search';
      return this.http.post<Book[]>(url, body,  {
         headers: new HttpHeaders({
           'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
         })
       });

    }

  searchById(id) {

    let url = 'https://rathe.app/api/searchById.php?bookid=' + id;
    // let url = 'http://local.hockeyapi.com/api/searchById/' + id;
    return this.http.get<Book>(url,{
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      })
    });

  }

    setBooks(data) {
      this.books = data;
    }

    getBooks() {
      return this.books;
    }


}
