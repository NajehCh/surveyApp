import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { ApiResponse, EnqueteData, QuestionData } from '../../types';
import { QuestionItem } from '../../component/question-item/question-item';
import { BehaviorSubject, Observable } from 'rxjs';


@Component({
  selector: 'app-enquete',
  standalone: true,
  imports: [CommonModule, QuestionItem,FormsModule, ReactiveFormsModule],
  templateUrl: './enquete.html',
  styleUrls: ['./enquete.css']
})
export class Enquete implements OnInit {

  
  id_enquete!: string;
  enquete!: EnqueteData;

  questionsSubject = new BehaviorSubject<QuestionData[]>([]);
  questions$!: Observable<QuestionData[]>;

  isSubmitted = signal(false);
  email: string = ''; 
  isLoading = true;
  answers: { [id_question: string]: any } = {};

 
  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id_enquete = params.get('id_enquete')!;
      this.questions$ = this.questionsSubject.asObservable();

      this.userService.getEnquete(this.id_enquete).subscribe({
        next: (res: ApiResponse<EnqueteData>) => {
          this.enquete = res.data as EnqueteData & { questions: QuestionData[] };
          this.questionsSubject.next(this.enquete.questions || []);
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;

        }
      });
    });
  }

  handleAnswerChange(event: { id_question: string; id_option?: string; value?: any }) {
    this.answers[event.id_question] = {
      id_option: event.id_option,
      value: event.value
    };
    console.log('Réponses actuelles:', this.answers);
  }
  checkAllRequiredAnswered(): boolean {
    let valid = true;
    (this.enquete.questions || []).forEach(q => {
      const ans = this.answers[q.id_question];
      if (q.required && (!ans || (Array.isArray(ans.value) && ans.value.length === 0))) {
        valid = false;
      }
    });
    return valid;
  }
  submitEnquete() {
    this.isSubmitted.set(true);
  
    // 1️⃣ Vérifier toutes les questions obligatoires
    const allRequiredAnswered = this.checkAllRequiredAnswered();
    if (!allRequiredAnswered) {
      window.alert('Veuillez remplir toutes les questions obligatoires !');
      return;
    }
  
    // 2️⃣ Vérifier que l’email est rempli
    if (!this.email) {
      window.alert("Veuillez entrer votre email !");
      return;
    }
  
    // 3️⃣ Préparer le tableau de réponses
    const answersArray = Object.keys(this.answers).map(id_question => {
      let val = this.answers[id_question].value;
  
      // Si c’est un tableau (checkbox multiple), transformer en string
      if (Array.isArray(val)) {
        val = val.join(', '); // ou JSON.stringify(val) si tu veux garder le format tableau
      }
  
      // Forcer tout en string (texte, nombre, booléen)
      val = String(val ?? '');
  
      return {
        id_question,
        id_option: this.answers[id_question].id_option,
        value: val
      };
    });
  
    // 4️⃣ Construire le payload
    const payload = {
      id_enquete: this.id_enquete,
      email: this.email,
      answers: answersArray
    };
  
    console.log('Payload à envoyer:', payload);
  
    // 5️⃣ Appel API
    this.userService.responseEnquete(payload).subscribe({
      next: (res) => {
        window.alert('Merci ! Votre formulaire a été envoyé.');
        console.log('Réponse API:', res);
      },
      error: (err) => {
        console.error('Erreur API:', err);
        window.alert('Erreur lors de l\'envoi de l\'enquête.');
      }
    });
  }
  
  onCheckboxChange(questionId: string, optionValue: string, checked: boolean) {
    if (!this.answers[questionId]) {
      this.answers[questionId] = [];
    }
  
    if (checked) {
      this.answers[questionId].push(optionValue);
    } else {
      this.answers[questionId] = this.answers[questionId].filter(
        (o: string) => o !== optionValue
      );
    }
  }

  
}
