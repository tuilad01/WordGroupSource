import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
var TestanimationComponent = /** @class */ (function () {
    function TestanimationComponent() {
        this.flip = true;
    }
    TestanimationComponent.prototype.ngOnInit = function () {
    };
    TestanimationComponent.prototype.toggleFlip = function () {
        this.flip = !this.flip;
    };
    TestanimationComponent = tslib_1.__decorate([
        Component({
            selector: 'app-testanimation',
            templateUrl: './testanimation.component.html',
            styleUrls: ['./testanimation.component.css'],
            animations: [
                trigger('flipState', [
                    state('active', style({
                        transform: 'rotateY(180deg)',
                        opacity: '0'
                    })),
                    state('inactive', style({
                        transform: 'rotateY(0)',
                        opacity: '1'
                    })),
                    transition('active => inactive', animate('400ms ease-out')),
                    transition('inactive => active', animate('400ms ease-in')),
                ]),
            ]
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], TestanimationComponent);
    return TestanimationComponent;
}());
export { TestanimationComponent };
//# sourceMappingURL=testanimation.component.js.map