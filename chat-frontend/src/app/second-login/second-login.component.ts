import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-second-login',
  templateUrl: './second-login.component.html',
  styleUrls: ['./second-login.component.css']
})
export class SecondLoginComponent implements OnInit {
  showDialogeBox = false;
  constructor( private dataService: DataService, private router: Router) { }
  userLogin(user: NgForm) {
    const userDetail = {
      email: user.value.email,
      password: user.value.password
    };
    this.dataService.login(userDetail)
    .subscribe (
      res => {
             console.log(res);
             localStorage.setItem('token', res.token);
             localStorage.setItem('name', res.name);
             localStorage.setItem('username', res.username);
             localStorage.setItem('email', res.email);
             this.router.navigate(['/chat/', localStorage.getItem('username')]);
            },
      err => { console.log(err);
        this.showDialogeBox = true;
         }
    );
  }
  ngOnInit() {
  }

}
