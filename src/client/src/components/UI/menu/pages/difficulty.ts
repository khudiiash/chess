
import { Page } from "./page";
import { button, text } from "../elements";
import { events } from "@/../../globals";
import {boundClass} from 'autobind-decorator'
import { Difficulty } from "@/types";

@boundClass
export class DifficultyPage extends Page {

    code: string;
    difficulty: Difficulty;
    
    build() {
      super.build();
      this.addBackButton();
    }

    get name() {
      return 'difficulty';
    }

    get structure() {
      const { easy, medium, hard } = Difficulty;
      return [
        text('Choose game difficulty'),
        button(easy,   () => this.setDifficulty(easy),   ['difficulty']),
        button(medium, () => this.setDifficulty(medium), ['difficulty']),
        button(hard,   () => this.setDifficulty(hard),   ['difficulty'])
      ]
    }

    setDifficulty(difficulty: Difficulty) {
      this.difficulty = difficulty;
      this.observer.emit(events.difficulty, this.difficulty);
      this.startGameWithMode('ai');
    }
  
}