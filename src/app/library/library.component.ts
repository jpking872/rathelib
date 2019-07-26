import {Component, OnInit, ViewChild, ElementRef, AfterViewInit, TemplateRef} from '@angular/core';
import { Observable } from 'rxjs';
import { MainService } from '../main.service';
import { Book } from '../book';
import { Search } from '../search';
import { NgScrollbar } from 'ngx-scrollbar';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { trigger, state, style, animate, transition } from '@angular/animations';

declare var $: any;

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css'],
})

export class LibraryComponent implements OnInit, AfterViewInit {

  @ViewChild(NgScrollbar, {static: false}) scrollRef: NgScrollbar;
  @ViewChild('scrollingBox', {static: false}) scrollingBox: ElementRef;
    public modalRef: BsModalRef;

  public params: Search;
  public books: Book[] = [];
  public featuredBooks: Book[];
  public size: number;
  public more: boolean = true;
  public reset: boolean = false;
  public loading = false;
  public noResults = false;
  public bookdata: Book;
  public detail: boolean;

  public coverpath: string = 'https://rathe.app/portal/newdir/store-tank/cover-art/';
  public authorpath: string = 'https://rathe.app/portal/newdir/store-tank/bio-photo/';

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  constructor(private mainService: MainService, private modalService: BsModalService) {

      this.size = 24;
      this.params = new Search('', 'false', [], 0, this.size);
      this.detail = false;

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
      this.search(true);

  }

    ngAfterViewInit() {
        this.scrollRef.scrollable.elementScrolled().subscribe(e => {
            let elem = e.target as HTMLDivElement;
            let pos = elem.scrollTop + elem.clientHeight;
            let max = elem.scrollHeight;
            if (pos >= max && this.more === true) {
                console.log('get more');
                this.getMore();
            }
        });
    }

    showDetail(book) {
      this.bookdata = book;
      this.detail = true;
    }

    hideDetail() {
      this.detail = false;
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
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
      this.search(false);

  }

  resetPage() {
      this.params.start = 0;
      this.reset = true;
      this.more = true;
  }

  search(clear) {

      this.detail = false;

      if (clear) {
          this.loading = true;
          this.books = [];
      }

      this.noResults = false;

      this.params.magic = this.selectedItems;
      this.mainService.search(this.params).subscribe(
          data => {

              if (data.length === 0) {
                  this.more = false;
              }

              const tmpBooks: Book[] = data;
              this.books.push(...tmpBooks);
              this.mainService.setBooks(this.books);
              this.books = this.mainService.getBooks();

              this.scrollRef.update();

              if (this.books.length === 0) {
                  this.noResults = true;
              }

              this.loading = false;
          },
          err => {
              console.log(err);
          },
          () => { console.log(); }
      );
  }

}
