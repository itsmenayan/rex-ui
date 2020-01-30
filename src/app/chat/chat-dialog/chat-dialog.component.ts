import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ChatService, Message } from '../chat.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/scan';
import { SpeechRecognizerService } from '../../web-speech/shared/services/speech-recognizer.service';
import { SpeechSynthesizerService } from '../../web-speech/shared/services/speech-synthesizer.service';
import { SpeechNotification } from '../../web-speech/shared/model/speech-notification';
import { $ } from 'protractor';



@Component({
  selector: 'chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.scss'],
})
export class ChatDialogComponent implements OnInit {

  messages: Observable<Message[]>;
  formValue: string;
  recognition;
  finalTranscript = '';
  recognizing = false;
  notification: string;
  languages: string[] = ['en-US', 'es-ES'];
  currentLanguage: string;

  isShow = true;

  constructor(public chat: ChatService, private changeDetector: ChangeDetectorRef,
    private speechRecognizer: SpeechRecognizerService,
    private speechSynthesizerService: SpeechSynthesizerService) { }

  ngOnInit() {
    // appends to array after each new message is added to feedSource
    this.messages = this.chat.conversation.asObservable()
      .scan((acc, val) => {
        console.log(acc);
        console.log(val);
        this.recognition = false;
        var objDiv = document.getElementById("chatBot");
        objDiv.scrollTop = objDiv.scrollHeight;

        return acc.concat(val)
      });
      
    this.currentLanguage = this.languages[0];
    this.speechRecognizer.initialize(this.currentLanguage);
    this.initRecognition();
    

    // this.chat.conversation.asObservable().subscribe(value =>{
    //   console.log(value);
    // })


  }

  sendMessage() {
    this.recognition = true;
    this.chat.converse(this.formValue);
    this.formValue = '';
  }




  startButton(event) {
    this.finalTranscript = '';
    this.speechRecognizer.start(event.timeStamp);

  }

  stopButton() {
    this.detectChanges();
    console.log("Stop" + this.finalTranscript);
    if(this.finalTranscript != ''){
      this.recognition = true;
      this.chat.converse(this.finalTranscript);
    }
    this.speechRecognizer.stop();
    this.speechSynthesizerService.speak(this.finalTranscript, 'en-US');

  }


  onSelectLanguage(language: string) {
    this.currentLanguage = language;
    this.speechRecognizer.setLanguage(this.currentLanguage);
  }

  private initRecognition() {
    this.speechRecognizer.onStart()
      .subscribe(data => {
        this.recognizing = true;
        this.notification = 'I\'m listening...';
        this.detectChanges();
      });


    this.speechRecognizer.onEnd()
      .subscribe(data => {
        console.log(this.finalTranscript);

        this.recognizing = false;
        this.detectChanges();
        this.notification = null;
      });

    this.speechRecognizer.onResult()
      .subscribe((data: SpeechNotification) => {
           const message = data.content;
           console.log("Final" + data.content);
           console.log("Final" + data.info);
           
        if (data.info === 'final_transcript' && message.length > 0) {
          this.finalTranscript = `${this.finalTranscript}\n${message}`;
          console.log("Inside if " + this.finalTranscript);
          
          // this.actionContext.processMessage(message, this.currentLanguage);
          this.detectChanges();
          // this.actionContext.runAction(message, this.currentLanguage);
        }
      });


  }

  detectChanges() {
    this.changeDetector.detectChanges();
  }

  closeChatBot() {
    console.log('close chat bot');
    if(this.isShow){
      this.chat.firstMessage("Hi Nayan. How may I help you?");
    }else{
      
    }
    this.isShow = !this.isShow;
  }



}
