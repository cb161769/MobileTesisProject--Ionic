import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomeDevicePagePage } from './home-device-page.page';

describe('HomeDevicePagePage', () => {
  let component: HomeDevicePagePage;
  let fixture: ComponentFixture<HomeDevicePagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeDevicePagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeDevicePagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
