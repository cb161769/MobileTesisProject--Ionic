import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StatisticsPagePage } from './statistics-page.page';

describe('StatisticsPagePage', () => {
  let component: StatisticsPagePage;
  let fixture: ComponentFixture<StatisticsPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticsPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticsPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
