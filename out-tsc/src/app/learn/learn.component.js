import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
var LearnComponent = /** @class */ (function () {
    function LearnComponent(http) {
        this.http = http;
        this.dataTemp = [];
        this.data = [
            {
                id: 1,
                name: "Computer Programmer 1",
                mean: "Clarke Calculator",
                display: true,
                flipped: false
            },
            {
                id: 2,
                name: "Computer Programmer 2",
                mean: "Clarke Calculator",
                display: true,
                flipped: false
            },
            {
                id: 3,
                name: "Computer Programmer 3",
                mean: "Clarke Calculator",
                display: true,
                flipped: false
            },
            {
                id: 4,
                name: "Computer Programmer 4",
                mean: "Clarke Calculator",
                display: true,
                flipped: false
            },
            {
                id: 5,
                name: "Computer Programmer 5",
                mean: "Clarke Calculator",
                display: true,
                flipped: false
            },
            {
                id: 6,
                name: "Computer Programmer 6",
                mean: "Clarke Calculator",
                display: true,
                flipped: false
            },
            {
                id: 7,
                name: "Computer Programmer 7",
                mean: "Clarke Calculator",
                display: true,
                flipped: false
            },
            {
                id: 8,
                name: "Computer Programmer 8",
                mean: "Clarke Calculator",
                display: true,
                flipped: false
            },
            {
                id: 9,
                name: "Computer Programmer 9",
                mean: "Clarke Calculator",
                display: true,
                flipped: false
            },
            {
                id: 10,
                name: "Computer Programmer 10",
                mean: "Clarke Calculator",
                display: true,
                flipped: false
            },
            {
                id: 11,
                name: "Computer Programmer 11",
                mean: "Clarke Calculator",
                display: true,
                flipped: false
            },
            {
                id: 12,
                name: "Computer Programmer 12",
                mean: "Clarke Calculator",
                display: true,
                flipped: false
            },
            {
                id: 13,
                name: "Computer Programmer 13",
                mean: "Clarke Calculator",
                display: true,
                flipped: false
            },
            {
                id: 14,
                name: "Computer Programmer 14",
                mean: "Clarke Calculator",
                display: true,
                flipped: false
            },
        ];
    }
    LearnComponent.prototype.ngOnInit = function () {
    };
    LearnComponent.prototype.getWord = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.http.get("https://localhost:4000/word")];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    LearnComponent.prototype.shuffle = function (array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    };
    LearnComponent.prototype.random = function () {
        return this.data = this.shuffle(this.data);
    };
    LearnComponent.prototype.delete = function (indexWord) {
        var word = this.data.find(function (element, index) {
            return index == indexWord;
        });
        return word.display = false;
    };
    LearnComponent.prototype.reset = function () {
        for (var i = 0; i < this.data.length; i++) {
            var word = this.data[i];
            word.display = true;
        }
    };
    LearnComponent.prototype.save = function () {
        var data = this.data.map(function (word) {
            return {
                id: word.id,
                display: word.display
            };
        }).slice();
        this.dataTemp = data;
    };
    LearnComponent.prototype.dispose = function () {
        return this.dataTemp = [];
    };
    LearnComponent.prototype.try = function () {
        for (var i = 0; i < this.dataTemp.length; i++) {
            var wordTemp = this.dataTemp[i];
            for (var j = 0; j < this.data.length; j++) {
                var word = this.data[j];
                if (word.id == wordTemp.id) {
                    word.display = wordTemp.display;
                    break;
                }
            }
        }
    };
    LearnComponent.prototype.flipped = function (id) {
        var word = this.data.find(function (word) { return word.id == id; });
        word.flipped = !word.flipped;
    };
    LearnComponent = tslib_1.__decorate([
        Component({
            selector: 'app-learn',
            templateUrl: './learn.component.html',
            styleUrls: ['./learn.component.css'],
            animations: [
                trigger('flipState', [
                    state('active', style({
                        transform: 'rotateY(180deg)',
                    })),
                    state('inactive', style({
                        transform: 'rotateY(0)',
                    })),
                    transition('active => inactive', animate('400ms ease-out')),
                    transition('inactive => active', animate('400ms ease-in')),
                ]),
            ]
        }),
        tslib_1.__metadata("design:paramtypes", [HttpClient])
    ], LearnComponent);
    return LearnComponent;
}());
export { LearnComponent };
//# sourceMappingURL=learn.component.js.map