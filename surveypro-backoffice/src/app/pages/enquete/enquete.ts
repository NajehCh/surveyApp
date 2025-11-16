import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

// Types
import { EnqueteData, EnqueteStatus, QuestionData } from '../../types';

// Services
import { EnqueteService } from '../../services/enquete.service';
import { QuestionService } from '../../services/question.service';
import { AuthService } from '../../services/auth.service';

// Composants
import { QuestionModal } from '../../modal/question_modal/question.modal';
import { EnqueteModal } from '../../modal/enquete_modal/enquete.model';
import { QuestionItem } from '../../components/question-item/question-item';
import { QuestionHeader } from '../../components/question-header/question-header';

// Icônes
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faUser, faCalendar, faEdit, faFileAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-enquete',
  imports: [
    EnqueteModal,
    QuestionItem,
    QuestionModal,
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './enquete.html',
  styleUrls: ['./enquete.css'],
  providers: [DatePipe]
})
export class Enquete {

  // ⚡ Flags et états
  isPreviewMode = false;
  modalOpen = false;

  // ⚡ Données
  id_enquete!: string;
  enquete!: EnqueteData;
  selectedEnquete?: EnqueteData;
  editingQuestion: QuestionData | null = null;

  // ⚡ Observables
  private questionsSubject = new BehaviorSubject<QuestionData[]>([]);
  questions$ = this.questionsSubject.asObservable();

  // ⚡ Icônes
  faCalendar = faCalendar;
  faUser = faUser;
  faEdit = faEdit;
  faTrash = faTrash;
  faFileAlt = faFileAlt;
  countResponse = 0;

  // ⚡ Labels et classes
  statusLabels: Record<EnqueteStatus, string> = {
    active: 'Actif',
    draft: 'Brouillon',
    closed: 'Clôturé',
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private enqueteService: EnqueteService,
    private questionService: QuestionService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef // ⚡ Ajouté pour forcer le rendu
  ) {}

  // ======================
  // ⚡ Cycle de vie
  // ======================
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id_enquete');
    if (id) {
      this.id_enquete = id;
      this.loadEnquete();
      console.log()
      this.loadQuestions();
      this.loadResponse();
    } else {
      console.error('⚠️ Aucun id_enquete trouvé dans l’URL');
      this.questionsSubject.next([]);
    }
  }

  statusEnquete(): string {
    return this.enquete.status;
  }

  // ======================
  // ⚡ Chargement des données
  // ======================
  private loadEnquete() {
    this.enqueteService.getEnqueteById(this.id_enquete).subscribe({
      next: (res) => {
        this.enquete = res.data;
        this.cdr.detectChanges(); // ⚡ Force le rafraîchissement du template
      },
      error: (err) => console.error('Erreur API', err)
    });
  }

  private loadResponse() {
    this.enqueteService.getEnqueteResponseById(this.id_enquete).subscribe({
      next: (res) => {
        this.countResponse = res.length;
        this.cdr.detectChanges(); // ⚡ Force le rafraîchissement
      },
      error: (err) => console.error('Erreur API', err)
    });
  }

  private loadQuestions() {
    this.questionService.getQuestionsByEnquete(this.id_enquete).subscribe({
      next: (res) => {
        this.questionsSubject.next(res);
        this.cdr.detectChanges(); // ⚡ Force le rafraîchissement
      },
      error: (err) => this.questionsSubject.next([])
    });
  }

  // ======================
  // ⚡ Navigation
  // ======================
  goHome() {
    this.router.navigate(['/home']);
  }

  // ======================
  // ⚡ Gestion des questions
  // ======================
  onQuestionCreated(newQuestion: QuestionData) {
    const current = this.questionsSubject.value;
    this.questionsSubject.next([...current, newQuestion]);
    this.cdr.detectChanges();
  }

  handleDeleteQuestion(id_question: string) {
    this.questionService.deleteQuestion(id_question).subscribe({
      next: () => {
        const current = this.questionsSubject.value;
        this.questionsSubject.next(current.filter(q => q.id_question !== id_question));
        this.showToast('Question supprimée', '', 'success');
        this.cdr.detectChanges();
      },
      error: () => this.showToast('Erreur', 'Impossible de supprimer la question', 'destructive')
    });
  }

  getResponsesCount(): number {
    return this.countResponse;
  }

  // ======================
  // ⚡ Gestion de l’enquête
  // ======================
  togglePreview() {
    this.isPreviewMode = !this.isPreviewMode;
  }

  get isClosed(): boolean {
    return this.enquete?.status === 'closed';
  }

  deleteEnquete() {
    if (!this.enquete) return;
    const confirmed = confirm('Êtes-vous sûr de vouloir supprimer cette enquête ?');
    if (!confirmed) return;

    this.enqueteService.deleteEnquete(this.id_enquete).subscribe({
      next: () => {
        this.showToast("Enquête supprimée", '', 'success');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Erreur suppression enquête', err);
        this.showToast('Erreur', 'Impossible de supprimer l’enquête', 'destructive');
      }
    });
  }

  publierEnquete() {
    if (!this.enquete) return;
    
  // Vérifier que l’enquête a au moins une question avant de publier
  if (this.enquete.status !== 'active' && this.questionsSubject.value.length === 0) {
    this.showToast('Impossible de publier', 'L’enquête doit contenir au moins une question', 'destructive');
    return;
  }
  // Déterminer le nouveau status
  const newStatus = this.enquete.status === 'active' ? 'closed' : 'active';


  this.enqueteService.changeStatusEnquete(this.enquete.id_enquete, newStatus).subscribe({
    next: (res: any) => {
      this.enquete.status = res.status; // ton backend renvoie déjà l'objet mis à jour
      
      if (newStatus === 'active') {
        this.showToast('Enquête publiée', 'Elle est maintenant accessible aux utilisateurs', 'success');
      } else {
        this.showToast('Enquête stoppée', 'Elle n’est plus accessible aux utilisateurs', 'warning');
      }
  
      this.cdr.detectChanges();
    },
    error: (err) => {
  
      // ✅ Récupération du message d'erreur backend
      const errorMessage =
        err.error?.message || 'Impossible de publier l’enquête. Veuillez réessayer.';
  
      // ✅ Afficher un toast ou un alert
      this.showToast('Erreur', errorMessage, 'destructive');
  
      // OU si tu veux un popup natif :
      // alert(errorMessage);
    },
  });
  
  }

  updateEnquete(updated: EnqueteData) {
    this.enquete = updated;
    this.selectedEnquete = undefined;
    this.cdr.detectChanges();
  }

  // ======================
  // ⚡ Gestion du modal
  // ======================
  openEditModal() {
    if (!this.enquete) return;
    this.selectedEnquete = { ...this.enquete };
    this.modalOpen = true;
    this.cdr.detectChanges();
  }

  handleModalChange(event: boolean) {
    this.modalOpen = event;
    if (!event) this.selectedEnquete = undefined;
    this.cdr.detectChanges();
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedEnquete = undefined;
    this.cdr.detectChanges();
  }

  // ======================
  // ⚡ Utils
  // ======================
  showToast(title: string, description: string, variant: string = 'default') {
    alert(`${title}\n${description} [${variant}]`);
  }

  getStatusText(status: EnqueteStatus): string {
    switch (status) {
      case 'active': return 'Active';
      case 'draft': return 'Brouillon';
      case 'closed': return 'Clôturé';
      default: return status;
    }
  }

  disabledStatus(): boolean {
    return this.enquete.status === "active";
  }

  onEditQuestion(question: QuestionData) {
    this.editingQuestion = question;
  }

  onQuestionSaved(updatedQuestion: QuestionData) {
    const current = this.questionsSubject.value;
    const index = current.findIndex(q => q.id_question === updatedQuestion.id_question);
    if (index !== -1) {
      current[index] = updatedQuestion;
      this.questionsSubject.next([...current]);
    }
    this.editingQuestion = null;
    this.cdr.detectChanges();
  }

  get questionsCount(): number {
    return this.questionsSubject.value.length;
  }
}
