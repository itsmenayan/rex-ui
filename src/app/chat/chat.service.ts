import { Injectable, NgZone } from '@angular/core';
import { environment } from '../../environments/environment';

import { ApiAiClient, ApiAiConstants } from 'api-ai-javascript';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SpeechSynthesizerService } from '../web-speech/shared/services/speech-synthesizer.service';

export class Message {
  constructor(public content: string, public sentBy: string, public timeStamp: string,public data:any) {}
  
}

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

@Injectable()
export class ChatService {

  readonly token = environment.dialogflow.angularBot;
  readonly client = new ApiAiClient({ accessToken: this.token,
    lang: ApiAiConstants.AVAILABLE_LANGUAGES.EN });

  conversation = new BehaviorSubject<Message[]>([]);
  payload = new BehaviorSubject<any>({});

  constructor(private zone: NgZone,private speechSynthesizerService: SpeechSynthesizerService) {}

  // Sends and receives messages via DialogFlow
  converse(msg: string) {
    
    const userMessage = new Message(msg, 'user',this.getTimeStamp(),null);
    this.update(userMessage);

    return this.client.textRequest(msg)
               .then(res => {
                 console.log("_____");
                 
                 console.log(res);
                 const obj = Object.assign(res);
                 console.log(obj.result.fulfillment.messages[0].speech);
                 console.log(obj);
                 
                  const speech = obj.result.fulfillment.messages[0].speech;
                  const botMessage = new Message(speech, 'bot',this.getTimeStamp(),obj.result.fulfillment.data);
                  this.speechSynthesizerService.speak(speech, 'en-US');
                  this.update(botMessage);
                  this.payload.next(obj.result.fulfillment.data);
               });
  }

  firstMessage(text:string){
    const userMessage = new Message(text, 'bot',this.getTimeStamp(),null);
    this.update(userMessage);
    this.speechSynthesizerService.speak(text, 'en-US');
  }



  // Adds message to source
  update(msg: Message) {
    this.conversation.next([msg]);
  }

  getTimeStamp(){
    var d = new Date();
    var spl = d.toString().split(' ');
    var time = spl[4].split(':')
    return spl[2] + '-' + spl[1] + ' ' + time[0] + ':' + time[1]
  }

  


}
