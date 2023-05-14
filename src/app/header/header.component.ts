import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Input() clicks: number = 0;
  @Input() characters: number = 0;
  @Input() chats: number = 0;
  @Input() responsesLength: number = 0;
  firstName: string = localStorage.getItem('firstName')!;
  lastName: string = localStorage.getItem('lastName')!;
  loginTime = new Date(localStorage.getItem('loginTime')!);
  formattedLoginTime =
    this.loginTime.toDateString() + ' ' + this.loginTime.toTimeString().split(' ')[0];
  logoutTime: string = '';
  seconds: number = 0;
  minutes: number = 0;
  hours: number = 0;

  constructor(private router: Router) {}

  logout(): void {
    const logoutTime = new Date();
    const loginTime = new Date(localStorage.getItem('loginTime')!);
    const timeDiffInMs = logoutTime.getTime() - loginTime.getTime();
    const seconds = Math.floor(timeDiffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    alert(
      `Time logged in: ${hours}:${minutes}:${seconds} \nTotal length of your responses: ${this.responsesLength}`
    );
    localStorage.setItem('logged', 'false');
    this.router.navigate(['./login']);
  }
}
