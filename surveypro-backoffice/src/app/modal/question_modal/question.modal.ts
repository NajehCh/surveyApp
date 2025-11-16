import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../enviroments/environment';
import { QuestionData } from '../../types';
import { AuthService } from '../../services/auth.service';
import { faX,faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { QuestionService } from '../../services/question.service';

@Component({
  selector: 'app-question-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule, FontAwesomeModule],
  templateUrl: './question.modal.html',
  styleUrls: ['./question.modal.css']
})
export class QuestionModal implements OnChanges {

  @Input() id_enquete!: string;
  @Input() questionToEdit: QuestionData | null = null; // pour l'édition
  @Input() statusEnquete?: string;

  @Output() questionCreated = new EventEmitter<QuestionData>();
  @Output() questionSaved = new EventEmitter<QuestionData>();

  questionForm: FormGroup;
  isSubmitting = false;
  faX = faX;
  faPlusCircle=faPlusCircle
  private apiUrl = environment.apiUrl;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private _httpClient: HttpClient,
    private router: Router,
    private questionService : QuestionService
  ) {
    this.questionForm = this.fb.group({
      text_question: ['', [Validators.required, Validators.minLength(6)]],
      id_enquete: ['', Validators.required],
      createdAt: [null],
      updatedAt: [null],
      type: ['', Validators.required],
      required: [false],
      options: this.fb.array([])
    });

    // Mettre à jour options selon le type
    this.questionForm.get('type')?.valueChanges.subscribe(type => {
      this.setOptionsByType(type);
    });
  }

  // -----------------------------
  // Gestion des options dynamiques
  // -----------------------------
  get optionControls() {
    return this.questionForm.get('options') as FormArray;
  }

  addOption() {
    this.optionControls.push(this.fb.control('', Validators.required));
  }

  removeOption(index: number) {
    this.optionControls.removeAt(index);
  }
  setOptionsByType(type: string) {
    // ⚡ Seulement ajouter des options si aucune option n’existe déjà
    if (this.optionControls.length > 0) return;
  
    switch (type) {
      case 'yes_no':
        this.optionControls.push(this.fb.control('Oui', Validators.required));
        this.optionControls.push(this.fb.control('Non', Validators.required));
        break;
  
      case 'text':
      case 'rating':
        this.optionControls.push(this.fb.control('', Validators.required));
        break;
  
      case 'radio':
      case 'checkbox':
      case 'select':
        // ⚡ laisser vide, options ajoutables dynamiquement
        break;
    }
  }
  
  // -----------------------------
  // Gestion des changements d'inputs
  // -----------------------------
  ngOnChanges(changes: SimpleChanges) {
    if (changes['id_enquete'] && this.id_enquete) {
      this.questionForm.patchValue({ id_enquete: this.id_enquete });
    }
  
    if (changes['questionToEdit'] && this.questionToEdit) {
      const q = this.questionToEdit;
      console.log(this.questionToEdit)
      this.questionForm.patchValue({
        text_question: q.text_question || '',
        type: q.type || '',
        required: q.required ?? false,
        id_enquete: this.id_enquete,
        createdAt: q.createdAt || new Date(),
        updatedAt: q.updatedAt || new Date()
      });
  
      // ⚡ Options : conserver les options existantes si elles sont déjà là
      if (q.options && q.options.length) {
        // Si aucune option dans le formArray → remplir
        if (this.optionControls.length === 0) {
          q.options.forEach(opt =>
            this.optionControls.push(this.fb.control(opt.text_option, Validators.required))
          );
        }
      } else {
        this.setOptionsByType(q.type);
      }
    }
  }
  
  // -----------------------------
  // Soumission du formulaire
  // -----------------------------
  onSubmit() {
    const now = new Date();
  
    // ⚡ Mettre à jour la date
    this.questionForm.patchValue({
      updatedAt: now,
      createdAt: this.questionToEdit?.createdAt || now
    });
    const payload: QuestionData =this.questionForm.value ;
    this.isSubmitting = true;
    console.log(this.questionForm.value)

    if (this.questionToEdit) {
      // ⚡ Édition → PATCH
      this.questionService.updateQuestion(this.questionToEdit.id_question, payload).subscribe({
        next: (res) => {
          console.log(res)
          this.isSubmitting = false;
          this.optionControls.clear();
          this.questionForm.reset({ id_enquete: this.id_enquete });
          this.questionSaved.emit(res); // émettre l'événement de sauvegarde
        },
        error: (err) => {
          console.error('Erreur édition question', err);
          this.isSubmitting = false;
        }
      });
    } else {
      // ⚡ Création → POST
      this.questionService.createQuestion(payload).subscribe({
        next: (res) => {
          console.log(res)
          this.isSubmitting = false;
          this.optionControls.clear();
          this.questionForm.reset({ id_enquete: this.id_enquete });
          this.questionCreated.emit(res); // émettre l'événement de création
        },
        error: (err) => {
          console.error('Erreur création question', err);
          this.isSubmitting = false;
        }
      });
    }
  }
  
  canSubmit(): boolean {
    const type = this.questionForm.get('type')?.value;

    if (['radio', 'checkbox', 'select'].includes(type)) {
      const nonEmptyOptions = this.optionControls.controls.filter(
        ctrl => ctrl.value && ctrl.value.trim() !== ''
      ).length;
      return nonEmptyOptions >= 2 && this.questionForm.valid;
    }
    return this.questionForm.valid;
  }

  isClosed(): boolean {
    return this.statusEnquete === 'closed';
  }
}
