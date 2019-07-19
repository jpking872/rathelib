import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { Book } from '../book';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {MainService} from '../main.service';
import {NgScrollbar} from 'ngx-scrollbar';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  @Input() bookdata: Book;
  @ViewChild(NgScrollbar, {static: false}) scrollDetail: NgScrollbar;
  public modalRef: BsModalRef;
  public showbio: boolean = false;


  constructor(private modalService: BsModalService) {

  }

  ngOnInit() {
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

}
