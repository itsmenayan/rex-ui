import { ActionStrategy } from '../strategy/action-strategy';
import { SpeechSynthesizerService } from '../../services/speech-synthesizer.service';

export class ActionContext {
    private currentStrategy: ActionStrategy;
    private speechSynthesizer = new SpeechSynthesizerService();

    processMessage(message: string, language: string) {
        // if (message.toLowerCase() === this.changeColorStrategy.getStartSignal(language)) {
        //     this.setStrategy(this.changeColorStrategy);
        //     this.speechSynthesizer.speak(this.currentStrategy.getInitialResponse(language), language);
        // } else if (message.toLowerCase() === this.changeColorStrategy.getEndSignal(language)) {
        //   this.speechSynthesizer.speak(this.currentStrategy.getFinishResponse(language), language);
        //   this.setStrategy(null);
        // }
        this.speechSynthesizer.speak(this.currentStrategy.getFinishResponse(language), language);
    }

    runAction(input: string, language: string) {
        if (this.currentStrategy) {
            this.currentStrategy.runAction(input, language);
        }
    }

    setStrategy(strategy: ActionStrategy) {
        this.currentStrategy = strategy;
    }
}
