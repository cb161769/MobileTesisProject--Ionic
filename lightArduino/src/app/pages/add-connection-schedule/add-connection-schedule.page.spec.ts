import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddConnectionSchedulePage } from './add-connection-schedule.page';

describe('AddConnectionSchedulePage', () => {
  let component: AddConnectionSchedulePage;
  let fixture: ComponentFixture<AddConnectionSchedulePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddConnectionSchedulePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddConnectionSchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
