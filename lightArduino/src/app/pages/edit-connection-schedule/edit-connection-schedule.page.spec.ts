import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditConnectionSchedulePage } from './edit-connection-schedule.page';

describe('EditConnectionSchedulePage', () => {
  let component: EditConnectionSchedulePage;
  let fixture: ComponentFixture<EditConnectionSchedulePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditConnectionSchedulePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditConnectionSchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
