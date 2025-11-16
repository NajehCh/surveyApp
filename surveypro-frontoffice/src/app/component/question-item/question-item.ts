import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionData } from '../../types';

@Component({
  selector: 'app-question-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question-item.html',
  styleUrls: ['./question-item.css']
})
export class QuestionItem {
  @Input() question!: QuestionData;
  @Input() index!: number;
  
  // ✅ flag pour savoir si le formulaire a été soumis
  @Input() formSubmitted: boolean = false;

  @Output() answerChange = new EventEmitter<{ id_question: string,id_option?: string,value:any }>(); 

  selectedOptions: string[] = [];
  selectedRating?: number;
  textAnswer: string = '';      // <-- AJOUTÉ

  // Méthode générique pour radio, text, select
  onAnswer(id_option?: string, value?: any) {
    this.answerChange.emit({
      id_question: this.question.id_question,
      id_option,
      value
    });
  }

  // Méthode pour select
  onSelectChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOptionId = selectElement.value;
    const selectedOption = this.question.options.find(opt => opt.id_option === selectedOptionId);

    this.onAnswer(selectedOption?.id_option, selectedOption?.text_option);
  }

  // Méthode pour checkbox
  handleCheckboxChange(optionId: string, text: string, checked: boolean) {
    if (checked) {
      this.selectedOptions.push(optionId);
    } else {
      this.selectedOptions = this.selectedOptions.filter(id => id !== optionId);
    }

    this.onAnswer(undefined, this.selectedOptions.map(id => {
      const opt = this.question.options.find(o => o.id_option === id);
      return opt?.text_option;
    }));
  }

  // Méthode pour rating
  toggleRating(r: number) {
    if (this.selectedRating === r) {
      this.selectedRating = undefined;
    } else {
      this.selectedRating = r;
    }
    this.onAnswer(undefined, this.selectedRating);
  }
}
