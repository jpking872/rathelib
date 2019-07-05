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

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  constructor(private mainService: MainService, private modalService: BsModalService) {

      this.currentStart = 0;
      this.numPerPage = 6;
      this.params = new Search('', '', [], true, []);
      this.search(this.params);

  }

  ngOnInit() {

      this.dropdownList = [
          { item_id: 'adventure', item_text: 'Adventure' },
          { item_id: 'escape', item_text: 'Escape' },
          { item_id: 'fantasy', item_text: 'Fantasy' },
          { item_id: 'fright', item_text: 'Fright' },
          { item_id: 'fun', item_text: 'Fun' },
          { item_id: 'history', item_text: 'History' },
          { item_id: 'hope', item_text: 'Hope' },
          { item_id: 'inspiration', item_text: 'Inspiration' },
          { item_id: 'learning', item_text: 'Learning' },
          { item_id: 'mystery', item_text: 'Mystery' },
          { item_id: 'passion', item_text: 'Passion' },
          { item_id: 'romance', item_text: 'Romance' },
          { item_id: 'soul', item_text: 'Soul' },
          { item_id: 'surprise', item_text: 'Surprise' },
          { item_id: 'thrill', item_text: 'Thrill' },
          { item_id: 'you', item_text: 'You' }
      ];

      this.dropdownSettings = {
          singleSelection: false,
          idField: 'item_id',
          textField: 'item_text',
          itemsShowLimit: 20,
          enableCheckAll: false,
          allowSearchFilter: false,

      };

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

  search(formData) {
      formData.magic = this.selectedItems;
      console.log(formData);

      this.mainService.search(formData).subscribe(
          data => {
              console.log(data);
              this.mainService.setBooks(data);
              this.books = this.mainService.getBooks();
              this.currentStart = 0;
              this.totalItems = this.books.length;
              this.maxStart = Math.floor(this.totalItems / this.numPerPage ) * this.numPerPage;
              this.showBooks = this.books.slice(0, this.numPerPage);
          },
          err => {
              console.log(err);
          },
          () => { console.log(); }
      );
  }

}
