import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { MainService } from '../main.service';
import { Book } from '../book';
import { Search } from '../search';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgScrollbar } from 'ngx-scrollbar';

import { trigger, state, style, animate, transition } from '@angular/animations';

declare var $: any;

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css'],
})

export class LibraryComponent implements OnInit {

  @ViewChild(NgScrollbar, {static: false}) scrollRef: NgScrollbar;
  @ViewChild('scrollingBox', {static: false}) scrollingBox: ElementRef;

  public modalRef: BsModalRef;
  public params: Search;
  public books: Book[] = [];
  public showBooks: Book[];
  public featuredBooks: Book[];
  public currentStart: number;
  public numPerPage: number;
  public totalItems: number;
  public maxStart: number;
  public size: number;
  public more: boolean = true;

  public scrollPosition: number;

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  constructor(private mainService: MainService, private modalService: BsModalService) {

      this.currentStart = 0;
      this.numPerPage = 6;
      this.scrollPosition = 0;
      this.size = 4;
      this.params = new Search('', 'false', [], 0, this.size);

  }

  ngOnInit() {

      this.dropdownList = [
          { item_id: 'adventure' },
          { item_id: 'escape' },
          { item_id: 'fantasy' },
          { item_id: 'fright' },
          { item_id: 'fun' },
          { item_id: 'history' },
          { item_id: 'hope' },
          { item_id: 'inspiration' },
          { item_id: 'learning' },
          { item_id: 'mystery' },
          { item_id: 'passion' },
          { item_id: 'romance'},
          { item_id: 'soul' },
          { item_id: 'surprise' },
          { item_id: 'thrill' },
          { item_id: 'you' }
      ];

      this.dropdownSettings = {
          singleSelection: false,
          idField: 'item_id',
          textField: 'item_id',
          itemsShowLimit: 20,
          enableCheckAll: false,
          allowSearchFilter: false,

      };

      this.getNewBooks();
      this.search();

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

  getNewBooks() {
      const params = new Search('', 'true', [], 0, this.size);

      this.mainService.search(params).subscribe(
          data => {
              this.featuredBooks = data;
          },
          err => {
              console.log(err);
          },
          () => { console.log(); }
      );
  }

  getMore() {

      this.params.start++;
      this.search();

  }

  resetPage() {
      this.params.start = 0;
      this.books = [];
      this.more = true;
  }

  scrollPage(dir) {

      const scrollAmount = 496;
      const currentPos = this.scrollingBox.nativeElement.scrollTop;

      if (dir === 'down') {
          this.scrollPosition = currentPos + scrollAmount;
      } else if (dir === 'up') {
          this.scrollPosition = currentPos - scrollAmount;
      }

      console.log(currentPos, this.scrollPosition);

      this.scrollingBox.nativeElement.scrollTop = this.scrollPosition;


  }

  search() {

      console.log(this.params);

      this.params.magic = this.selectedItems;
      this.mainService.search(this.params).subscribe(
          data => {

              if (data.length === 0) {
                  this.more = false;
              }

              /*for (let i = 0; i < 10; i++) {
                  this.books.push(...data);
              }*/

              const tmpBooks: Book[] = data;
              this.books.push(...tmpBooks);
              this.mainService.setBooks(this.books);
              this.books = this.mainService.getBooks();

              /*this.currentStart = 0;
              this.totalItems = this.books.length;
              this.maxStart = Math.floor(this.totalItems / this.numPerPage ) * this.numPerPage;
              this.showBooks = this.books.slice(0, this.numPerPage);*/
          },
          err => {
              console.log(err);
          },
          () => { console.log(); }
      );
  }

}
