import { Injectable, NgZone } from '@angular/core';
import { environment } from '../../environments/environment';

import { ApiAiClient } from 'api-ai-javascript';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SpeechSynthesizerService } from '../web-speech/shared/services/speech-synthesizer.service';

export class Message {
  constructor(public content: string, public sentBy: string) {}
}

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

@Injectable()
export class ChatService {

  readonly token = environment.dialogflow.angularBot;
  readonly client = new ApiAiClient({ accessToken: this.token });

  conversation = new BehaviorSubject<Message[]>([]);

  constructor(private zone: NgZone,private speechSynthesizerService: SpeechSynthesizerService) {}

  // Sends and receives messages via DialogFlow
  converse(msg: string) {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);

    return this.client.textRequest(msg)
               .then(res => {
                 console.log("_____");
                 
                 console.log(res);
                 const obj = Object.assign(res);
                 console.log(obj.result.fulfillment.messages[0].speech);
                 console.log(obj);
                 
                  const speech = obj.result.fulfillment.messages[0].speech;
                  const botMessage = new Message(speech, 'bot');
                  this.speechSynthesizerService.speak(speech, 'en-US');
                  this.update(botMessage);
               });
  }



  // Adds message to source
  update(msg: Message) {
    this.conversation.next([msg]);
  }

  


}
