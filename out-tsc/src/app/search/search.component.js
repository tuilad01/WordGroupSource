import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
var SearchComponent = /** @class */ (function () {
    function SearchComponent() {
    }
    SearchComponent.prototype.ngOnInit = function () {
        var input = document.querySelector('.search-form');
        var search = document.querySelector('input');
        var button = document.querySelector('button');
        button.addEventListener('click', function (e) {
            e.preventDefault();
            input.classList.toggle('active');
        });
        search.addEventListener('focus', function () {
            input.classList.add('focus');
        });
        search.addEventListener('blur', function () {
            search.value.length != 0 ? input.classList.add('focus') : input.classList.remove('focus');
        });
    };
    SearchComponent = tslib_1.__decorate([
        Component({
            selector: 'app-search',
            templateUrl: './search.component.html',
            styleUrls: ['./search.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], SearchComponent);
    return SearchComponent;
}());
export { SearchComponent };
//# sourceMappingURL=search.component.js.map