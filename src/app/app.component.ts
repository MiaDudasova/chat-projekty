import { Component } from '@angular/core';
import { BehaviorSubject, Subject, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map, switchMap, pluck } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, Message } from './interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  loggedTrueFalse: boolean = false;
  clickCount: number = 0;
  charactersCount: number = 0;
  chatsOpenedCount: number = 0;
  prev: string = '';
  users: User[] = [];
  usersFiltered: User[] = [];
  // tempChats = [
  //   {
  //     text: 'a',
  //     time: 'a',
  //     receiver: 'a',
  //     response: 'a',
  //     responseTime: 'a',
  //   },
  // ];
  clickUser: boolean = false;
  userId: number = 5;
  userDetails: any = {};
  genderData: any = {};
  moreData: any = {};
  showData: boolean = false;
  show: boolean = false;
  chatName: string = '';
  showChat: boolean = true;
  chats: Message[] = [];
  tempChats: Message[] = [];
  // message: string = '';
  // responseMessage: string = '';
  // lenJsonText: number = 0;
  // lastOriginNum: number = 0;
  postTime: string = '';
  // responseTime: string = '';
  text: string = '';
  loggedFirstName: string = '';
  loggedLastName: string = '';
  loggedInTime: string = '';
  // loggedTime: string = '';
  // splittedLoggedTime: string[] = [];
  // logged: boolean = false;
  lenResponses: number = 0;
  // logoutTime: string = '';
  // secondsLogged: number = 0;
  // minutesLogged: number = 0;
  // hoursLogged: number = 0;
  detailId: number = 0;
  
  async onClick(): Promise<void> {
    this.clickCount++;
  }

  async chatsOpened(): Promise<void> {
    this.chatsOpenedCount++;
  }

  constructor(private httpClient: HttpClient, private router: Router) {
    this.getUsers().subscribe((users) => {
      this.users = users;
      this.usersFiltered = users.filter(
        (user) =>
          user.firstName !== this.loggedFirstName &&
          user.lastName !== this.loggedLastName
      );
    });

    this.getUserDetails().subscribe((userDetails) => {
      this.userDetails = userDetails;
    });
  }

  ngOnInit() {
    if (localStorage.getItem('logged-in') != 'true') {
      this.loggedTrueFalse = false;
    } else if (localStorage.getItem('logged-in') != 'false') {
      this.loggedTrueFalse = true;
    }

    // if (this.loggedInTime !== null) {
    //   this.splittedLoggedTime = this.loggedInTime.split(' ');
    //   this.loggedTime =
    //     this.splittedLoggedTime[2] +
    //     ' ' +
    //     this.splittedLoggedTime[1] +
    //     ' ' +
    //     this.splittedLoggedTime[3] +
    //     ' ' +
    //     this.splittedLoggedTime[4];
    // }

    this.userIdChanges().subscribe((userId) => {
      this.userId = userId;
      this.getUserDetails().subscribe((userDetails) => {
        this.userDetails = userDetails;
      });
    });
  }

  login(firstName: string, lastName: string): void {
    if (
      this.users.find((data: { firstName: string; lastName: string }) => {
        return data.firstName === firstName && data.lastName === lastName;
      }) != undefined
    ) {
      this.loggedFirstName = firstName;
      this.loggedLastName = lastName;
      this.loggedInTime = new Date().toString();
      this.loggedTrueFalse = true;
      localStorage.setItem('logged-in', 'true');
    }
  }

  userClick(id: number) {
    this.detailId = id;
    this.clickUser = !this.clickUser;
  }

  private getUsers(): Observable<User[]> {
    return this.httpClient
      .get('https://dummyjson.com/users')
      .pipe(map((res: any) => res.users as User[]));
  }

  async onChar(event: KeyboardEvent): Promise<void> {
    const inputValue = (event.target as HTMLInputElement).value;
    if (inputValue.length > this.prev.length) {
      this.charactersCount++;
    }
    this.prev = inputValue;
  }

  getUserDetails(): Observable<User[]> {
    return this.httpClient.get<User[]>(
      'https://dummyjson.com/users/' + this.userId
    );
  }

  userIdChanges(): Observable<number> {
    const userId$ = new BehaviorSubject<number>(this.userId);

    return this.httpClient
      .get('https://dummyjson.com/users/' + this.userId)
      .pipe(
        map((res: any) => res as { userId: number }), // type assertion
        pluck('userId'),
        tap((userId) => userId$.next(userId)),
        switchMap(() => userId$)
      );
  }

  post(bodyText: string) {
    const url = 'http://httpbin.org/post';
    const responseDate = new Date();
    const responseTime = responseDate.toLocaleTimeString();

    return this.httpClient.post<any>(url, { text: bodyText }).pipe(
      tap((response) => {
        const responseData = response.json;

        this.chats.push({
          text: responseData.text,
          time: this.postTime,
          receiver: this.chatName,
          response: 'A'.repeat(
            responseData.text.length + Number(response.origin.slice(-1))
          ),
          responseTime: responseTime,
        });

        this.tempChats = this.chats.slice(-10);

        this.lenResponses = this.chats.reduce(
          (acc: any, cur: any) => acc + cur.response.length,
          0
        );
      })
    );
  }

  handleSubmit(e: any) {
    e.preventDefault();
    const time = new Date();
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    this.postTime = `${hours}:${minutes}:${seconds}`;
    this.post(this.text);
    this.text = '';
  }

  handleKeyUp(e: any) {
    if (e.keyCode === 13) {
      this.handleSubmit(e);
    }
  }

  changeUserId(newUserId: number) {
    this.userId = newUserId;
    this.getUserDetails().subscribe((userDetails) => {
      this.userDetails = userDetails;
      this.getData();
    });
    this.show = true;
  }

  getData() {
    const postalCode = this.userDetails.company.address.postalCode;
    const zipRequest$ = this.httpClient.get(
      `https://api.zippopotam.us/us/${postalCode}`
    );
    const genderRequest$ = this.httpClient.get(
      `https://api.genderize.io/?name=${this.userDetails.firstName}`
    );

    forkJoin({ zipData: zipRequest$, genderData: genderRequest$ }).subscribe(
      (response) => {
        this.moreData = response.zipData;
        this.genderData = response.genderData;
        this.showData = true;
      }
    );
  }

  logout(): void {
    this.loggedTrueFalse = false;
    localStorage.removeItem('logged-in');
    // this.logoutTime = new Date().toString();
    // if (this.loggedInTime != null) {
    //   this.secondsLogged =
    //     Math.abs(
    //       new Date(this.loggedInTime).getTime() -
    //         new Date(this.logoutTime).getTime()
    //     ) / 1000;
    // }
    // if (this.secondsLogged >= 60) {
    //   this.minutesLogged = Math.floor(this.secondsLogged / 60);
    //   this.secondsLogged =
    //     this.secondsLogged - Math.floor(60 * this.minutesLogged);
    // }
    // if (this.minutesLogged >= 60) {
    //   this.hoursLogged = Math.floor(this.minutesLogged / 60);
    //   this.minutesLogged =
    //     this.minutesLogged - Math.floor(60 * this.hoursLogged);
    // }
    // this.router.navigate(['./']);
  }

  hideData() {
    this.showData = false;
  }


  closeDetail() {
    this.show = false;
  }

  closeChat() {
    this.tempChats = [];
    this.showChat = false;
  }
}
