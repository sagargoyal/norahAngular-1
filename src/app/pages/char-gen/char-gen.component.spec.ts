import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharGenComponent } from './char-gen.component';

describe('CharGenComponent', () => {
  let component: CharGenComponent;
  let fixture: ComponentFixture<CharGenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharGenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharGenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
