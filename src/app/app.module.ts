import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MainService } from './main.service';

import { AppComponent } from './app.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { LibraryComponent } from './library/library.component';
import { BookComponent } from './book/book.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchFormComponent,
    LibraryComponent,
    BookComponent
  ],
  imports: [
    BrowserModule,
      FormsModule,
      HttpClientModule
  ],
  providers: [MainService],
  bootstrap: [AppComponent]
})
export class AppModule { }
