import { AuthService } from './../../services/auth.service';
import { UserService } from './../../services/user.service';
import { ChatService } from './../../services/chat.service';
import { Component, OnInit } from '@angular/core';
import { Subscription, from } from 'rxjs';
import { FsService } from 'ngx-fs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageCompressService, ResizeOptions, ImageUtilityService, IImage, SourceImage } from 'ng2-image-compress';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  message: string;
  to: string;
  touser: string;
  messages: string[] = [];
  users: any[] = [];
  username: string = undefined;
  interval: any;
  userSubscription: Subscription;
  chatSubscription: Subscription;
  id: string;
  chats: any;
  chat_users = new Set();
  path: string;
  fileToUpload: File = null;
  imageurl: any;
  FILE: any;
  selectedImage: any;
  processedImages: any = [];
  showTitle = false;
  length: number;

  constructor(private chatService: ChatService, private userService: UserService, private authService: AuthService, private fsService: FsService, private domSanitizer: DomSanitizer) {


   this.userSubscription = userService.getUsers().subscribe(users => {
      // this.users = users;
      this.users = [];
      this.users.push(...users);
      console.log(this.users);

    if (!authService.string_id) {
      authService.getId().subscribe(id => {
        this.id = id;
        chatService.getChats(id).subscribe(chats => {
          this.chats = chats;
          console.log(chats);
          for (let i = 0; i < chats.length(); i++) {
            this.chat_users.add(chats[i].from);
          }
          console.log(this.chat_users);
        });
      });
    } else {
      this.id = authService.string_id;
      chatService.getChats(this.id).subscribe(chats => {
        this.chats = chats;
        console.log(chats);
        for (let i = 0; i < chats.length; i++) {
          this.chat_users.add(chats[i].from);
        }
        console.log(this.chat_users);
      });
    }
  });

    this.username = authService.string_user;

    this.chatSubscription =  this.chatService
    .getMessages()
    .subscribe((messageObject: any) => {
      // this.messages.push(message);
      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].username === messageObject.to || this.users[i].username === messageObject.from) {
          console.log('This message is intended from ' + messageObject.from + ' to ' + messageObject.to);
          this.users[i].chats.push(messageObject);
        }
      }
    });

    // this.interval = setInterval(() => {
    //   userService.getUsers().subscribe(users => {
    //     // this.users = users;
    //     this.users = [];
    //   this.users.push(...users);
    //   console.log(this.users);
    // });
    // }, 10000);

    userService.getUsers().subscribe(users => {
      // this.users = users;
      this.users = [];
    this.users.push(...users);
    console.log(this.users);
  });
  }

  sendMessageTo() {
    console.log(this.to);
    if (this.message ) {
      this.messages.push(this.username + ': ' + this.message);
      this.chatService.sendMessageTo(this.to, this.username, this.message);
      console.log(this.to);
      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].username === this.touser || this.users[i].username === this.username) {
          console.log('This message is intended from ' + this.username + ' to ' + this.touser);
          this.users[i].chats.push({ to: this.touser, from: this.username, message: this.message, status: this.sendMessageTo, read: false, image: false, audio: false });
        }
      }
      this.message = '';

    }
  }
  ngOnInit() {
  this.chatService
    .getMessages()
    .subscribe((message: string) => {
      this.messages.push(message);
    });
  }

  logout() {
    clearInterval(this.interval);
    this.userSubscription.unsubscribe();
    this.chatSubscription.unsubscribe();
    this.authService.logOut();
  }

  focus(username) {
    console.log(username + '\'s messages');
    this.chatService.readMsg(username);
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].read === false) {
        this.users[i].read = true;
      }
    }
  }

  console() {
    console.log(this.path);
  }

  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    const file: File = inputValue.files[0];
    console.log(file);
    const type = file.type.split('/')[0];
    const myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.FILE = myReader.result;
      // this.imageurl = this.domSanitizer.bypassSecurityTrustUrl(myReader.result.toString());
      this.chatService.sendMessageTo(this.to, this.username, null, this.FILE, type);
    };
    myReader.readAsDataURL(file);

    const images: Array<IImage> = [];

    ImageCompressService.filesArrayToCompressedImageSource(Array.from(inputValue.files)).then(observableImages => {
      observableImages.subscribe((image) => {
        images.push(image);
      }, (error) => {
        console.log('Error while converting');
      }, () => {
                this.processedImages = images;
                this.showTitle = true;
                // console.log()
      });
    });

  }

  preview(event) {
    const modal = <HTMLDivElement>document.getElementById('myModal');
    console.log(event.srcElement);
    const modalImg = <HTMLImageElement>document.getElementById('img01');

      modal.style.display = 'block';
      modalImg.src = event.srcElement.src;


     const span = <HTMLSpanElement>document.getElementsByClassName('close')[0];
     span.onclick = function() {
       modal.style.display = 'none';
     };

  }
}
