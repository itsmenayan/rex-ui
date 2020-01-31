import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatDialogComponent, ObjectValuesPipe } from './chat-dialog/chat-dialog.component';
import { ChatService } from './chat.service';
import { ChartModule } from 'angular-highcharts';
import { FormsModule } from '@angular/forms';
import { OneshopComponent } from './chat-dialog/oneshop/oneshop.component';
import { OneappComponent } from './chat-dialog/oneapp/oneapp.component';
import { ChatRoutingModule } from './chat-routing.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChartModule,
    ChatRoutingModule
  ],
  declarations: [
    ChatDialogComponent,
    ObjectValuesPipe,
    OneshopComponent,
    OneappComponent
  ],
  exports: [ ChatDialogComponent ],
  providers: [ChatService]
})
export class ChatModule { }
