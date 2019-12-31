import { Component, OnInit } from '@angular/core';

import * as io from 'socket.io-client';

import { NavController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  socket:any

  // details: any;

  chat_input:string;
  
  chats = [];
  
  messages = [];
  
  nickname = '';
  
  message: string;
  
  constructor(public navCtrl: NavController, public toastCtrl:ToastController, private http: HttpClient) {
  
  this.socket = io('http://localhost:3000');
  
  this.socket.on('message', (msg) => {
  
  console.log("message", msg);
  
  this.chats.push(msg);
  
  });
  
  this.getMessages().subscribe(message => {
  
  this.messages.push(message);
  
  });
  
  this.getUsers().subscribe(data => {
  
  let user = data['user'];
  
  });
  
  }
  
  ionViewWillLeave() {
  
  this.socket.disconnect();
  
  }
  
  // send(msg) {
  // if(msg !=''){
  
  // this.socket.emit('message', msg);
  
  // }
  
  // this.chat_input ='';
  
  // }
  ngOnInit(){
    this.http.get<any>('http://localhost:3000/message')
    .subscribe( res =>{
      console.log(res);
      // this.details = JSON.stringify(res)
      this.chats = res;
    })
    this.getMessages();
      
  }
  getMessages() {
  
  let observable =new Observable(observer => {
  
  this.socket.on('message', (data) => {
  observer.next(data);
  
  });
  
  })
  
  return observable;
  
  }
  
  getUsers() {
  
  let observable =new Observable(observer => {
  
  this.socket.on('users-changed', (data) => {
  
  observer.next(data);
  
  });
  
  });
  
  return observable;
  
  }

  sendMessage(message) {
    this.socket.emit('message', message);
    this.chat_input ='';
  //  this.messages.push(message,name);
    this.addMessage({
      message})
    .subscribe( (res) =>{
      console.log(res);
    })
  }
  
  addMessage(message){
    // this.messages.push(value);
    console.log('message', message);
    return this.http.post<any>('http://localhost:3000/message', message);
  }

}
