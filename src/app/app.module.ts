import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { LearnComponent } from './learn/learn.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { TestanimationComponent } from './testanimation/testanimation.component';

const appRoutes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: 'learn', component: LearnComponent },
  {
    path: '',
    redirectTo: '/search',
    pathMatch: 'full'
  },
  { path: '**', component: PagenotfoundComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    LearnComponent,
    PagenotfoundComponent,
    TestanimationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      // { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
