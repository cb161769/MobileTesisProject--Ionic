import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  userName:any;
  userEmail:any;
  userPassword:any;
  userFirstName:any;
  userLastName:any;

  constructor() { }

  ngOnInit() {
  }

}
