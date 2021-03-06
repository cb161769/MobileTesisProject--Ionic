import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OptionsConectionOnePage } from './options-conection-one.page';

describe('OptionsConectionOnePage', () => {
  let component: OptionsConectionOnePage;
  let fixture: ComponentFixture<OptionsConectionOnePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsConectionOnePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OptionsConectionOnePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
