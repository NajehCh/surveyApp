import { Component, Input, Output, EventEmitter } from '@angular/core';
import { QuestionData, OptionData } from '../../types';
import { CommonModule } from '@angular/common';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-question-item',
  standalone:true,
  imports:[CommonModule,FontAwesomeModule],
  templateUrl: './question-item.html',
  styleUrls: ['./question-item.css']
})
export class QuestionItem {
    faEdit = faEdit;
    faTrash = faTrash;
  @Input() question!: QuestionData;
  @Input() index!: number;
  @Input() isPreviewMode: boolean = false;
  @Input() isClosed: boolean = false;

  @Output() edit = new EventEmitter<QuestionData>();
  @Output() delete = new EventEmitter<string>();
  ngOnInit() {
  }
  onEdit() {
    this.edit.emit(this.question);
  }

  onDelete() {
    this.delete.emit(this.question.id_question);
  }
}
