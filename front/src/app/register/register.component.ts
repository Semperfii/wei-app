import { Component } from '@angular/core';
import { AuthentificationService } from '../authentification/authentification.service';
import { Router } from '@angular/router';
import { TokenPayload } from '../authentification/authentification.model';

@Component({
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  credentials: TokenPayload = {
    email: '',
    name: '',
    password: ''
  };

  constructor(private auth: AuthentificationService, private router: Router) { }

  register() {
    this.auth.register(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/profile');
    }, (err) => {
      console.error(err);
    });
  }
}
