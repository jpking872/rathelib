import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Book } from '../book';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {MainService} from '../main.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  @Input() bookdata: Book;
  public modalRef: BsModalRef;

  constructor(private modalService: BsModalService) {

  }

  ngOnInit() {
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

}
