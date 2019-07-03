import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MainService } from '../main.service';
import { Book } from '../book';
import { Search } from '../search';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {

  public modalRef: BsModalRef;
  public params: Search;
  public books: Book[];
  public showBooks: Book[];
  public currentStart: number;
  public numPerPage: number;
  public totalItems: number;
  public maxStart: number;

  constructor(private mainService: MainService, private modalService: BsModalService) {
      this.currentStart = 0;
      this.numPerPage = 6;
      this.params = new Search('', '', [], true);
      this.mainService.search(this.params).subscribe(
          data => {
              this.mainService.setBooks(data);
              this.books = this.mainService.getBooks();
              this.totalItems = this.books.length;
              this.maxStart = Math.floor(this.totalItems / this.numPerPage ) * this.numPerPage;
              this.showBooks = this.books.slice(0, this.numPerPage);
              console.log(this.showBooks);
          },
          err => {
              console.log(err);
          },
          () => { console.log(); }
      );
  }

  ngOnInit() {

  }

  moveLeft() {
    this.currentStart -= this.numPerPage;
    if (this.currentStart < 0) { this.currentStart = 0; }
    this.showBooks = this.books.slice(this.currentStart, this.currentStart + this.numPerPage);

  }

  moveRight() {
      this.currentStart += this.numPerPage;
      if (this.currentStart > this.maxStart) { this.currentStart = this.maxStart; }
      this.showBooks = this.books.slice(this.currentStart, this.currentStart + this.numPerPage);
  }

}
