import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MainService } from './main.service';

import { AppComponent } from './app.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { LibraryComponent } from './library/library.component';
import { BookComponent } from './book/book.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    AppComponent,
    SearchFormComponent,
    LibraryComponent,
    BookComponent
  ],
  imports: [
    BrowserModule,
      BrowserAnimationsModule,
      FormsModule,
      HttpClientModule,
      ModalModule.forRoot(),
      PaginationModule.forRoot(),
      NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [MainService],
  bootstrap: [AppComponent]
})
export class AppModule { }
