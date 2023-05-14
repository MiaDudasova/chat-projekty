import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../types';
import { Chat } from '../types';
import { Observable, Subject, catchError, forkJoin, map, switchMap, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  // firstName: string = '';
  // lastName: string = '';
  // loginTime: string = '';
  // clicks: number = 0;
  // characters: number = 0;
  // chats: number = 0;
  // responsesLength: number = 0;
  // users: User[] = [];
  // tempChats: Chat[] = [];
  // showChat: boolean = false;
  // chatName: string = '';
  // allChats: Chat[] = [];
  // hideData() {
  //   this.showMoreData = false;
  // }
  // async onClick(): Promise<void> {
  //   this.clicks++;
  // }
  // async chatsOpened(): Promise<void> {
  //   this.chats++;
  // }
  // closeDetail() {
  //   this.detailShow = false;
  // }
  // closeChat() {
  //   this.tempChats = [];
  //   this.showChat = false;
  // }
  // prevInputValue: string = ""
  // onChar(event: Event): void {
  //   const inputValue = (event.target as HTMLInputElement).value;
  //   const delta = inputValue.length - this.prevInputValue.length;
  //   this.characters += delta > 0 ? delta : 0;
  //   this.prevInputValue = inputValue;
  // }

  // constructor(private router: Router, private httpClient: HttpClient) {
  //   this.httpClient
  //     .get('https://dummyjson.com/users')
  //     .subscribe((users: any) => {
  //       this.users = users?.users || [];
  //     });
  // }

  // ngOnInit(): void {
  //   if (localStorage.getItem('logged') == 'false') {
  //     this.router.navigate(['./login']);
  //   }

  //   this.firstName = localStorage.getItem('firstName')!;
  //   this.lastName = localStorage.getItem('lastName')!;
  //   this.loginTime = localStorage.getItem('loginTime')!;
  // }

  // detailId: number = 0;
  // userClicked: boolean = false;
  // userClick(id: number) {
  //   this.detailId = id;
  //   this.userClicked = !this.userClicked;
  // }

  // userId: number = 0;
  // userDetails: any = {};
  // detailShow: boolean = false;
  // async changeUserId(newUserId: number): Promise<void> {
  //   this.userId = newUserId;

  //   try {
  //     const userDetails = await this.httpClient
  //       .get('https://dummyjson.com/users/' + this.userId.toString())
  //       .toPromise();

  //     await this.getData().toPromise();

  //     this.detailShow = true;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // zipData: any = {};
  // genderData: any = {};
  // showMoreData: boolean = true;
  // getData(): Observable<any> {
  //   const zipCodeRequest = this.httpClient.get(
  //     'https://api.zippopotam.us/us/' +
  //       this.userDetails.company.address.postalCode
  //   );
  //   const genderRequest = this.httpClient.get(
  //     'https://api.genderize.io/?name=' + this.userDetails.firstName
  //   );

  //   return forkJoin([zipCodeRequest, genderRequest]).pipe(
  //     tap(([zipData, genderData]) => {
  //       this.zipData = zipData;
  //       this.genderData = genderData;
  //       this.showMoreData = true;
  //     })
  //   );
  // }

  // text: string = '';
  // postTime: string = '';
  // handleSubmit(e: Event): void {
  //   e.preventDefault();
  //   const text = this.text.trim();
  //   if (!text) {
  //     return;
  //   }
  //   this.postTime = new Date().toLocaleTimeString();
  //   this.post(text);
  //   this.text = '';
  // }

  // handleKeyUp(e: KeyboardEvent): void {
  //   if (e.key === 'Enter') {
  //     this.handleSubmit(e);
  //   }
  // }

  // post(bodyText: string): Observable<any> {
  //   const postTime = new Date().toLocaleTimeString();

  //   return this.httpClient
  //     .post<any>('http://httpbin.org/post', { text: bodyText })
  //     .pipe(
  //       map((response: any) => {
  //         const jsonResponse = response.json();
  //         const message = jsonResponse.text;
  //         const lenJsonText = message.length;
  //         const lastOriginNum = Number(response.origin.slice(-1));
  //         const responseMessage = 'A'.repeat(lenJsonText + lastOriginNum);
  //         const responseTime = new Date().toLocaleTimeString();

  //         const chat = {
  //           text: message,
  //           time: postTime,
  //           receiver: this.chatName,
  //           response: responseMessage,
  //           responseTime: responseTime,
  //         };

  //         this.allChats.push(chat);
  //         this.tempChats.push(chat);

  //         this.responsesLength = this.allChats.reduce(
  //           (acc, cur) => acc + cur.response.length,
  //           0
  //         );

  //         return response;
  //       }),
  //       catchError((error) => throwError(error))
  //     );
  // }

  clicks: number = 0;
  characters: number = 0;
  chats: number = 0;
  prevInputValue: string = '';
  users: User[] = [];
  userClicked: boolean = false;
  userId: number = 5;
  userDetails: any = {};
  genderData: any = {};
  zipData: any = {};
  showMoreData: boolean = true;
  detailShow: boolean = false;
  chatName: string = '';
  showChat: boolean = false;
  allChats: Chat[] = [];
  tempChats: Chat[] = [];
  message: string = '';
  responseMessage: string = '';
  lenJsonText: number = 0;
  lastOriginNum: number = 0;
  postTime: string = '';
  responseTime: string = '';
  text: string = '';
  loggedFirstName: string | null = localStorage.getItem('firstName');
  loggedLastName: string | null = localStorage.getItem('lastName');
  loggedInTime: string | null = localStorage.getItem('loginTime');
  loggedTime: string = '';
  splittedLoggedTime: string[] = [];  
  logged: boolean = false;
  responsesLength: number = 0;
  logoutTime: string = '';
  secondsLogged: number = 0;
  minutesLogged: number = 0;
  hoursLogged: number = 0;
  detailId: number = 0;

  constructor(private httpClient: HttpClient, private router: Router) {
    this.getUsers().subscribe((users) => {
      this.users = users.filter(
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
    if (localStorage.getItem('log') != 't') {
      this.router.navigate(['./login']);
    }

    this.logged = true;

    if (this.loggedInTime !== null) {
      this.splittedLoggedTime = this.loggedInTime.split(' ');
      this.loggedTime =
        this.splittedLoggedTime[2] +
        ' ' +
        this.splittedLoggedTime[1] +
        ' ' +
        this.splittedLoggedTime[3] +
        ' ' +
        this.splittedLoggedTime[4];
    }

    this.userIdChanges().subscribe((userId) => {
      this.userId = userId;
      this.getUserDetails().subscribe((userDetails) => {
        this.userDetails = userDetails;
      });
    });
  }

  userClick(id: number) {
    this.detailId = id;
    if (this.userClicked == false) {
      this.userClicked = true;
    } else if (this.userClicked == true) {
      this.userClicked = false;
    }
  }

  private getUsers(): Observable<User[]> {
    return this.httpClient
      .get('https://dummyjson.com/users')
      .pipe(map((res: any) => res.users as User[]));
  }

  async onChar(event: Event): Promise<void> {
    const inputValue = (event.target as HTMLInputElement).value;
    if (inputValue.length > this.prevInputValue.length) {
      this.characters++;
    }
    this.prevInputValue = inputValue;
  }

  getUserDetails(): Observable<User[]> {
    return this.httpClient
      .get('https://dummyjson.com/users/' + this.userId.toString())
      .pipe(map((res: any) => res));
  }

  userIdChanges(): Observable<number> {
    const subject = new Subject<number>();

    return this.httpClient
      .get('https://dummyjson.com/users/' + this.userId.toString())
      .pipe(
        map((res: any) => res.userId),
        tap((userId) => subject.next(userId)),
        switchMap(() => subject)
      );
  }

  postMessage(bodyText: string) {
    const url = 'http://httpbin.org/post';
    return this.httpClient.post<any>(url, { text: bodyText });
  }

  post(bodyText: string) {
    this.postMessage(bodyText).subscribe((response) => {
      this.message = response.json.text;
      this.lenJsonText = response.json.text.length;
      this.lastOriginNum = Number(response.origin.slice(-1));
      this.responseMessage = 'A'.repeat(this.lenJsonText + this.lastOriginNum);
      const responseDate = new Date();
      this.responseTime =
        responseDate.getHours() +
        ':' +
        responseDate.getMinutes() +
        ':' +
        responseDate.getSeconds();

      this.allChats.push({
        text: this.message,
        time: this.postTime,
        receiver: this.chatName,
        response: this.responseMessage,
        responseTime: this.responseTime,
      });

      this.tempChats.push({
        text: this.message,
        time: this.postTime,
        receiver: this.chatName,
        response: this.responseMessage,
        responseTime: this.responseTime,
      });

      this.responsesLength = this.allChats.reduce(
        (acc, cur) => acc + cur.response.length,
        0
      );
    });
  }

  handleSubmit(e: any) {
    e.preventDefault();
    if (this.text !== '' && this.text !== ' ') {
      const time = new Date();
      this.postTime =
        time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
      this.post(this.text);
      this.text = '';
    }
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
    this.detailShow = true;
  }

  getData() {
    this.httpClient
      .get(
        'https://api.zippopotam.us/us/' +
          this.userDetails.company.address.postalCode
      )
      .subscribe((zipData: any) => {
        this.zipData = zipData;
      });

    this.httpClient
      .get('https://api.genderize.io/?name=' + this.userDetails.firstName)
      .subscribe((genderData: any) => {
        this.genderData = genderData;
      });
    this.showMoreData = true;
  }

  logout(): void {
    this.logged = false;
    this.logoutTime = new Date().toString();
    if (this.loggedInTime != null) {
      this.secondsLogged =
        Math.abs(
          new Date(this.loggedInTime).getTime() -
            new Date(this.logoutTime).getTime()
        ) / 1000;
    }
    if (this.secondsLogged >= 60) {
      this.minutesLogged = Math.floor(this.secondsLogged / 60);
      this.secondsLogged =
        this.secondsLogged - Math.floor(60 * this.minutesLogged);
    }
    if (this.minutesLogged >= 60) {
      this.hoursLogged = Math.floor(this.minutesLogged / 60);
      this.minutesLogged =
        this.minutesLogged - Math.floor(60 * this.hoursLogged);
    }
    localStorage.removeItem('log');
    this.router.navigate(['./']);
  }

  hideData() {
    this.showMoreData = false;
  }

  async onClick(): Promise<void> {
    this.clicks++;
  }

  async chatsOpened(): Promise<void> {
    this.chats++;
  }

  closeDetail() {
    this.detailShow = false;
  }

  closeChat() {
    this.tempChats = [];
    this.showChat = false;
  }
}
