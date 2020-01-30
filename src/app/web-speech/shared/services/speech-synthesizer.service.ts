import { Injectable } from '@angular/core';

@Injectable()
export class SpeechSynthesizerService {

  message: SpeechSynthesisUtterance;
  voices:any[];

  constructor() {
    this.initSynthesis();
  }

  initSynthesis(): void {
    this.message = new SpeechSynthesisUtterance();
    this.message.volume = 1;
    this.message.rate = 1;
    this.message.pitch = 0.2;
    window.speechSynthesis.onvoiceschanged = e => {
      this.voices = window.speechSynthesis.getVoices();
      // do speech synthesis stuff
      // console.log(this.voices);
    }
    window.speechSynthesis.getVoices();

  }

  speak(message: string, language: string): void {

    this.message.lang = language;
    this.message.text = message;
    this.message.voice = this.voices[54];
    speechSynthesis.speak(this.message);
  }
}
