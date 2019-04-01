import * as tslib_1 from "tslib";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { LearnComponent } from './learn/learn.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { TestanimationComponent } from './testanimation/testanimation.component';
var appRoutes = [
    { path: 'search', component: SearchComponent },
    { path: 'learn', component: LearnComponent },
    {
        path: '',
        redirectTo: '/search',
        pathMatch: 'full'
    },
    { path: '**', component: PagenotfoundComponent }
];
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = tslib_1.__decorate([
        NgModule({
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
                RouterModule.forRoot(appRoutes)
            ],
            providers: [],
            bootstrap: [AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map