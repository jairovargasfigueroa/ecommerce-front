import { Injectable } from '@angular/core';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class VoiceCommandService {
  recognition: any;

  constructor() {
    const SpeechRecognition =  (window as any).SpeechRecognition || webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'es-ES';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
  }

  startListening(callback: (command: string) => void) {
    this.recognition.start();

    this.recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript;
      callback(command.toLowerCase());
    };

    this.recognition.onerror = (event: any) => {
      console.error('Error en reconocimiento de voz:', event.error);
    };
  }
}
