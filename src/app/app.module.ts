import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { ChatModule } from './chat/chat.module';
import { SpeechRecognizerService } from './web-speech/shared/services/speech-recognizer.service';
import { SpeechSynthesizerService } from './web-speech/shared/services/speech-synthesizer.service';
import { WebSpeechComponent } from './web-speech/web-speech.component';


@NgModule({
  declarations: [
    AppComponent,
    WebSpeechComponent
  ],
  imports: [
    BrowserModule,
    ChatModule,
  ],
  providers: [
    SpeechRecognizerService,
    SpeechSynthesizerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
