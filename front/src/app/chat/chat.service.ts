import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Message } from './message.model';
import * as io from 'socket.io-client';

import { Subject } from 'rxjs';
import { Observable, of } from 'rxjs';
import { reject } from 'q';

@Injectable({ providedIn: 'root' })
export class ChatService {

  socket = io('http://localhost:3000');

  private chats: Message[] = [];
  private chatsUpdated: Message[] = [];
  private message: Message;

  constructor(private http: HttpClient) { }

  getChatByRoom(room) {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise ((resolve, reject) => {
      this.http
      .get<any>('http://localhost:3000/chat/' + room)
      .subscribe(chatData => {
        console.log('data', chatData);
        resolve (chatData.chats);
      });
    });
  }

  saveChat(msgData) {
    this.message = msgData;
    this.http
      .post<Message>('http://localhost:3000/chat', this.message)
      // tslint:disable-next-line:no-shadowed-variable
      .subscribe(msgData => {
        this.chats.push(this.message);
        console.log('new chats', this.chats);

      });
    this.socket.emit('save-message', this.message);
  }
  // getChatByRoom(room) {
  //   return new Promise((resolve, reject) => {
  //     console.log(room);
  //     this.http.get('http://localhost:3000/chat/' + room)
  //       .pipe(map(res => res.json())) // transform en json
  //       .subscribe(res => {
  //         console.log("res", res);
  //         resolve(res); // return
  //       });
  //   });
  // }

  // saveChat(data) {
  //   return new Promise((resolve, reject) => {
  //       this.http.post('http://localhost:3000/chat', data)
  //         .pipe(map(res => res.json()))
  //         .subscribe(res => {
  //           resolve(res);
  //         });
  //   });
  // }

}
