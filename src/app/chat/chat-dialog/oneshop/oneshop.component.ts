import { Component, OnInit, ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { ChatService, Message } from '../../chat.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/scan';
import { SpeechRecognizerService } from '../../../web-speech/shared/services/speech-recognizer.service';
import { SpeechSynthesizerService } from '../../../web-speech/shared/services/speech-synthesizer.service';
import { SpeechNotification } from '../../../web-speech/shared/model/speech-notification';
import { Chart } from 'angular-highcharts';


@Pipe({
  name: 'objectValues'
})
export class ObjectValuesPipe implements PipeTransform {
  transform(obj: any) {
    let result = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        result.push({
          "id": key,
          "value" : obj[key]
        });
      }
    }
    return result;
  }
}

@Component({
  selector: 'oneshop',
  templateUrl: './oneshop.component.html',
  styleUrls: ['./oneshop.component.scss']
})
export class OneshopComponent implements OnInit {

  messages: Observable<Message[]>;
  formValue: string;
  recognition:boolean = false;
  finalTranscript = '';
  recognizing = false;
  notification: string;
  languages: string[] = ['en-US', 'es-ES'];
  currentLanguage: string;
  chart:any;

  isShow = true;

  constructor(public chat: ChatService, private changeDetector: ChangeDetectorRef,
    private speechRecognizer: SpeechRecognizerService,
    private speechSynthesizerService: SpeechSynthesizerService) { }

  ngOnInit() {
    // appends to array after each new message is added to feedSource
    this.messages = this.chat.conversation.asObservable()
      .scan((acc, val) => {
        console.log("Val");
        console.log(val);
        if(val[0].sentBy=='bot')
          this.recognition = false;


        if(val[0].data != null && val[0].data.type == 'CHART'){
          console.log("before data", val[0].data.data);
          this.createChart(val[0].data.data);
          console.log("after data", val[0].data.data);
        }

          
        // var objDiv = document.getElementById("chatBot");
        // objDiv.scrollTop = objDiv.scrollHeight +100;

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
    this.chat.converse(this.formValue,'John');
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
      this.chat.converse(this.finalTranscript,'John');
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
      this.chat.firstMessage("Hi John. How may I help you?");
    }else{

    }
    this.isShow = !this.isShow;
  }

  createPieChart(data){

    var chartData:any[] = [];
    for(var obj in data){

      if(!isNaN(data[obj])){
        chartData.push({
          name: obj,
          y: +data[obj],
          sliced: obj == 'calls' ? true: false,
          selected: false,
          color : obj == 'calls' ? 'red': ''

       });
      }
    }

    var chart = new Chart( {
    exporting: {
      chartOptions: { // specific options for the exported image
          plotOptions: {
              series: {
                  dataLabels: {
                      enabled: true
                  }
              }
          }
      },
      fallbackToExportServer: false
  },
    title: {
        text: 'Usasge Details'
    },
    series: [{
      type: 'pie',
      name: 'Usage Details',
      data: chartData
   }]
});
  return chart;
  }

  createChart(data:any){
    console.log(" createChart start",data);

      for (let index = 0; index < data.charts.length; index++) {
        const element = data.charts[index];
        if(element.type == 'PIE'){
          data.charts[index] = this.createPieChart(element.chart_data);
        }else if(element.type == 'LINE'){
          data.charts[index] = this.createLineChart(element.chart_data);

      }
      //data.charts.pop();
      console.log(" createChart end",data);
  }
}

  createLineChart(data){

    var chartData:any[] = [];
    for(var obj in data){

      if(!isNaN(data[obj])){
        chartData.push({
          name: obj,
          y: +data[obj],
          sliced: obj == 'calls' ? true: false,
          selected: false,
          color : obj == 'calls' ? 'red': ''

       });
      }
    }
     var chart = new Chart( {
      exporting: {
        chartOptions: { // specific options for the exported image
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true
                    }
                }
            }
        },
        fallbackToExportServer: false
    },
      title: {
          text: 'Combination chart'
      },
      xAxis: {
          categories: ['Jan', 'Feb', 'March', 'April', 'May',  'June', 'July', 'August']
      },
      series: [{
        type: 'spline',
        name: 'Calls',
        data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
    }, {
      type: 'spline',
        name: 'SMS',
        data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
    }, {
      type: 'spline',
        name: 'Data',
        data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
    }, {
      type: 'spline',
        name: 'Amount',
        data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
    }]
  });
  return chart;
  }




}
