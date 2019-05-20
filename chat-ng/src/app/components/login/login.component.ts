import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  signup = false;

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    firstname: new FormControl(''),
    lastname: new FormControl('')
  });

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  login() {
    console.log(this.loginForm.value);
    this.loginForm.patchValue({
      firstname: '',
      lastname: ''
    });
    this.authService.logIn(this.loginForm.value)
    .subscribe(res => {
      console.log(res);
      this.router.navigate(['/home']);
    });
  }

  signUp() {
    console.log(this.loginForm.value);
    this.authService.signup(this.loginForm.value).subscribe(res => {
      console.log(res);
    });
  }


}
