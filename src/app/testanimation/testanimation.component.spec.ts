import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestanimationComponent } from './testanimation.component';

describe('TestanimationComponent', () => {
  let component: TestanimationComponent;
  let fixture: ComponentFixture<TestanimationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestanimationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestanimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
