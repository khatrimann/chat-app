import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { localUrl } from 'src/constants';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

    private url = 'http://localhost:3000';
    private socket;

    constructor(private http: HttpClient) {
        this.socket = io(this.url);
    }

    public sendDisconnect() {
      this.socket.emit('logout');
    }

    public sendId(id) {
      this.socket.emit('login', id);
    }

    public sendMessageTo(to, from, message = null, buff = null, type = 'image') {
      // tslint:disable-next-line:no-non-null-assertion
      if (message != null && buff == null ) {
        this.socket.emit('msg', { message: message, to: to, from: from });
      } else if (message == null && buff != null) {
        console.log('image invoked');
        if (type === 'image') {
        this.socket.emit('image', { buff: buff, to: to, from: from });
        } else if (type === 'audio') {
          this.socket.emit('audio', { buff: buff, to: to, from: from });
          }
      }
    }

    public getMessages = () => {
      return Observable.create((observer) => {
          this.socket.on('pmsg', (messageObject) => {
            console.log(messageObject);
              observer.next(messageObject);
          });
      });
    }

    getChats(id): Observable<any> {
      return this.http.get<any>(localUrl + id + '/chats');
    }

    readMsg(user) {
      this.socket.emit('read', user);
    }

}
