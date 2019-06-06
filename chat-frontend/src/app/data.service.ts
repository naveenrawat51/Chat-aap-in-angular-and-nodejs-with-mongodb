import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {
  signupUrl = 'http://localhost:3000/api/signup';
  loginUrl = 'http://localhost:3000/api/login';
  messageUrl = 'http://localhost:3000/api/message';
  getMessageUrl = 'http://localhost:3000/api/messages/';
  
  constructor(private httpClient: HttpClient) { }
   // User signup
   signUp(user) {
    return this.httpClient.post<any>(this.signupUrl, user);
   }
    // login
  login(user) {
    return this.httpClient.post<any>(this.loginUrl, user);
  }
    // save messagep
  saveMessage(user) {
    return this.httpClient.post<any>(this.messageUrl, user);
   }
     // get Email Marketing Messages
     allMessages(newUser) {
      return this.httpClient.get<any>(this.getMessageUrl + newUser.room);
    }
}
