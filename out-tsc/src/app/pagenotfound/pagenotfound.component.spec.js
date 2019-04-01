import { async, TestBed } from '@angular/core/testing';
import { PagenotfoundComponent } from './pagenotfound.component';
describe('PagenotfoundComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [PagenotfoundComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(PagenotfoundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=pagenotfound.component.spec.js.map