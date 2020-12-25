import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { YourAccountPage } from './your-account.page';

describe('YourAccountPage', () => {
  let component: YourAccountPage;
  let fixture: ComponentFixture<YourAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourAccountPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(YourAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
