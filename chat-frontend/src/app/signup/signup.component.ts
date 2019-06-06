import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  showDialogeBox = false;
  constructor( private dataService: DataService, private router: Router) { }
  register(frm: NgForm) {
    const newUser = {
      Name: frm.value.Name,
      userName: frm.value.userName,
      email: frm.value.email,
      password: frm.value.password
    };
    this.dataService.signUp(newUser)
    .subscribe(
      res => {
        console.log('Account Created');
        localStorage.setItem('username', res.username);
        localStorage.setItem('name', res.name);
        localStorage.setItem('email', res.email);
      this.router.navigate(['/chat/', localStorage.getItem('username')]);
            },
      err => {
        console.log('this is error', err);
        this.showDialogeBox = true;
       }
    );

  }
  ngOnInit() {
  }

}
