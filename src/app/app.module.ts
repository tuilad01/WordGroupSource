import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { LearnComponent } from './learn/learn.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { TestanimationComponent } from './testanimation/testanimation.component';
import { WordComponent } from './word/word.component';
import { GroupComponent } from './group/group.component';
import { SettingComponent } from './setting/setting.component';

const appRoutes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: 'learn/:id', component: LearnComponent },
  { path: 'group', component: GroupComponent },
  { path: 'word', component: WordComponent },
  { path: 'setting', component: SettingComponent },
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
    TestanimationComponent,
    WordComponent,
    GroupComponent,
    SettingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      { useHash: true }
      // { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
