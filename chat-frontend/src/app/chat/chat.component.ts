import { Component, OnInit, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { ChatService } from '../chat.service';
import { Item } from '../item';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit{
  AllUsersOnline = [];
  historyMessages = [];
  chatHistory = [];
  showHistory = false;
  user = '';
  room: string;
  messageText: string;
  messageArray: Array<{user: string, message: string, time: string}> = [];
  historyArray: Item[] = [];
  typingShow = {};
  Name = '';
  userName = '';
  showJoin = false;
  showTypingPara = false;
  @ViewChild('chatWindow') chatWindow: ElementRef;

  constructor(private chatService: ChatService, private dataService: DataService, private router: Router) {
    this.chatService.newUserJoined()
  .subscribe( data => this.messageArray.push(data));

  this.chatService.userLeftRoom()
  .subscribe(data => this.messageArray.push(data));

  this.chatService.newMessageReceived()
  .subscribe(data => {
    this.messageArray.push(data);
    this.playAudio();
    this.typingShow = {};
    this.messageText = '';
  });

  this.chatService.userTyping()
  .subscribe(data => this.typingShow = data);

  this.chatService.allChat()
  .subscribe( data => this.chatHistory = data);

  this.chatService.allOnlineUsers()
  .subscribe( data => this.AllUsersOnline = data);
   }

  ngOnInit() {
  this.Name = localStorage.getItem('name');
  this.userName = localStorage.getItem('username');
  
  }
  
  playAudio() {
    const audio = new Audio();
    audio.src = './assets/msg1.mp3';
    audio.load();
    audio.play();
    }
    
  join() {
    this.chatService.joinRoom({user: this.Name, room: this.room});
    // for new user online
    this.chatService.newUser({user: this.userName, room: this.room});
    this.getMessages();

    this.showJoin = true;
    // console.log(this.chatHistory);
    // console.log(this.AllUsersOnline);
    this.showHistory = true;
  }
  leave() {
    this.chatService.leaveRoom({user: this.Name, room: this.room});
    this.historyMessages = [];
    this.messageArray = [];
    this.AllUsersOnline = [];
    this.showJoin = false;
  }
  sendMessage(event) {
    console.log(event)
    const date = new Date().toDateString();
    const time = new Date().toTimeString().split(' ')[0];
    this.chatService.sendMessage({user: this.Name, room: this.room, message: this.messageText, Date: date, Time: time});
    this.addMessage();
  }
  showTyping(event) {
    this.showTypingPara = true;
    if(event.code === "Enter"){
    const date = new Date().toDateString();
    const time = new Date().toTimeString().split(' ')[0];
    this.chatService.sendMessage({user: this.Name, room: this.room, message: this.messageText, Date: date, Time: time});
    this.addMessage();
    this.showTypingPara = false;
    }
    this.chatService.typing({user: this.Name, room: this.room});
    
  }

  addMessage() {
    const date1 = new Date().toDateString();
    const time1 = new Date().toTimeString().split(' ')[0];
    const newUser = {
      Name: localStorage.getItem('name'),
      userName: localStorage.getItem('username'),
      email: localStorage.getItem('email'),
      message: this.messageText,
      room: this.room,
      date: date1,
      time: time1
    };
    this.dataService.saveMessage(newUser)
    .subscribe(
      res => {
        console.log('Message saved!!');
            },
      err => {
        console.log('this is error', err);
       }
    );
  }
  getMessages() {
    const details = {
      room: this.room
    };
    this.dataService.allMessages(details)
    .subscribe(
      res => { this.historyMessages = res;
             },
      err => { console.log(err); }
    );
  }
  logoutUser() {
    localStorage.clear();
    this.router.navigate(['/ChatLogin']);
   // localStorage.removeItem('email');
  }

}
