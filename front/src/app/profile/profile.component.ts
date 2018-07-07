import { Component } from '@angular/core';
import { AuthentificationService } from '../authentification/authentification.service';
import { UserDetails } from '../authentification/authentification.model'

@Component({
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  details: UserDetails;

constructor(private auth: AuthentificationService) { }

  ngOnInit() {
    this.auth.profile().subscribe(user => {
      this.details = user;
    }, (err) => {
      console.error(err);
    });
  }
}