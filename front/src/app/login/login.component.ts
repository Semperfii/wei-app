import { Component } from '@angular/core';
import { AuthentificationService } from '../authentification/authentification.service';
import { Router } from '@angular/router';
import { TokenPayload } from '../authentification/authentification.model'

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent {
  credentials: TokenPayload = {
    email: '',
    password: ''
  };

  constructor(private auth: AuthentificationService, private router: Router) {}

  login() {
    this.auth.login(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/profile');
    }, (err) => {
      console.error(err);
    });
  }
}