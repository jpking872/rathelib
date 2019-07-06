import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Observable } from 'rxjs';
import { MainService } from '../main.service';
import { Search } from '../search';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {

  public params: Search;

  constructor(private mainService: MainService) {

    this.params = new Search('', '', [], false, []);
  }

  ngOnInit() {
  }

  onSubmit(search: Search) {
    this.mainService.search(search).subscribe(
        data => {
          this.mainService.setBooks(data);
        },
        err => {
          console.log(err);
        },
        () => { console.log(); }
  );

  }

}
