import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MainService } from './main.service';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LibraryComponent } from './library/library.component';
import { BookComponent } from './book/book.component';
import { PageNotFoundComponent} from './page-not-found/page-not-found.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgScrollbarModule } from 'ngx-scrollbar';

const appRoutes: Routes = [
  { path: '', component: LibraryComponent },
  { path: 'detail/:id', component: LibraryComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LibraryComponent,
    BookComponent,
      PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
      BrowserAnimationsModule,
      FormsModule,
      HttpClientModule,
      ModalModule.forRoot(),
      NgMultiSelectDropDownModule.forRoot(),
      NgScrollbarModule,
      RouterModule.forRoot(
        appRoutes,
        { enableTracing: true } // <-- debugging purposes only
    )

  ],
  providers: [MainService],
  bootstrap: [AppComponent]
})
export class AppModule { }
