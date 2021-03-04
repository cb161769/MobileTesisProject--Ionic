import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Connexion1Page } from './connexion1.page';

describe('Connexion1Page', () => {
  let component: Connexion1Page;
  let fixture: ComponentFixture<Connexion1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Connexion1Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Connexion1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
