import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faNoteSticky } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-question-header',
  standalone:true,
  imports: [CommonModule,FontAwesomeModule],
  templateUrl: './question-header.html',
  styleUrl: './question-header.css'
})
export class QuestionHeader {
  faNoteSticky = faNoteSticky;
  
  @Input() isPreviewMode: boolean = false;
  @Input() questionsCount: number = 0;
  @Output() previewToggle = new EventEmitter<void>();

  onPreviewClick() {
    this.previewToggle.emit();
  }
}
