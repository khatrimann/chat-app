import { AppRoutingModule } from './app-routing/app-routing.module';
import { ChatService } from './services/chat.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {NgxFsModule} from 'ngx-fs';
import { ImageCompressService,ResizeOptions,ImageUtilityService } from 'ng2-image-compress';


import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { TrustPipe } from './pipes/trust.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    TrustPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgxFsModule,
  ],
  providers: [
    ChatService,
    ImageCompressService,
    ResizeOptions
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
