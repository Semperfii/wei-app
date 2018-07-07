import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Message } from './message.model';
import * as io from 'socket.io-client';
import { NgForm } from '@angular/forms';
import { ChatService } from './chat.service';
import { Subscription } from 'rxjs';

import { AuthentificationService } from '../authentification/authentification.service';
import { UserDetails } from '../authentification/authentification.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  constructor(private chatService: ChatService, private auth: AuthentificationService) { }

  details: UserDetails;

  chats: any;
  socket = io('http://localhost:3000');
  newUser = {
    nickname: 'Belle',
    room: ''
  };
  msgData: Message = {
    _id: '',
    room: '',
    nickname: '',
    message: '',
    updated_at: null
  };
  joined: boolean;
  private chatSub: Subscription;

  ngOnInit() {
    this.auth.profile().subscribe(user => {
      this.details = user;
      this.newUser.nickname = this.details.name;
    });

    this.socket.on('new-message', function (data) {
      const user = this.newUser;
      if ((this.joined === true) && (data.message.room === user.room)) {
        this.chats.push(data.message);
        this.msgData = { room: user.room, nickname: user.nickname, message: '' };
      }
    }.bind(this));
  }

  joinRoom(form: NgForm) {
    const date = new Date();
    this.chatService.getChatByRoom(form.value.room).then((res) => {
      this.chats = res;
    });
    this.socket.emit('save-message',
    { _id: null, room: form.value.room, nickname: form.value.nickname, message: 'Join this room', updated_at: date });
    this.joined = true;
    this.newUser = {
      nickname: form.value.nickname,
      room: form.value.room
    };
  }

  sendMessage(form: NgForm) {
    this.msgData = {
      _id: null,
      room: this.newUser.room,
      nickname: this.newUser.nickname,
      message: form.value.message,
      updated_at: null
    };
    console.log(this.msgData);
    this.chatService.saveChat(this.msgData);
  }

  onLogout(): void {
    const date = new Date();
    const user = this.newUser;
    this.socket.emit('save-message', { room: user.room, nickname: user.nickname, message: 'Left this room', updated_at: date });
    this.joined = false;
  }

}
