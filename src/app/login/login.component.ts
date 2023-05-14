import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../types';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  users: User[] = [];

  constructor(private router: Router, private httpClient: HttpClient) {
    this.httpClient
      .get('https://dummyjson.com/users')
      .subscribe((users: any) => {
        this.users = users?.users || [];
      });
  }

  ngOnInit(): void {
    if (localStorage.getItem('logged') == 'true') {
      this.router.navigate(['./']);
    }
  }

  login(firstName: string, lastName: string): void {
    const foundUser = this.users.find(
      (user: User) => user.firstName === firstName && user.lastName === lastName
    );
    if (foundUser) {
      localStorage.setItem('firstName', firstName);
      localStorage.setItem('lastName', lastName);
      localStorage.setItem('loginTime', new Date().toString());
      localStorage.setItem('logged', 'true');
      this.router.navigate(['./']);
    }
  }
}
