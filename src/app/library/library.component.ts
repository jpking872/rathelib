import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MainService } from '../main.service';
import { Book } from '../book';
import { Search } from '../search';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {

  public params: Search;
  public books: Book[];

  constructor(private mainService: MainService) {
      this.params = new Search('', '', [], true);

      this.mainService.search(this.params).subscribe(
          data => {
              this.mainService.setBooks(data);
              this.books = this.mainService.getBooks();
              console.log(this.books);
          },
          err => {
              console.log(err);
          },
          () => { console.log(); }
      );
  }

  ngOnInit() {

  }

}
