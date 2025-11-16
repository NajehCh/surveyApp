import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ResponseService } from '../services/response.service';
import { EnqueteService } from '../services/enquete.service';
import { QuestionService } from '../services/question.service';
import { QuestionData } from '../types';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-responses-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './responses-list.html',
  styleUrls: ['./responses-list.css']
})
export class ResponsesList implements OnInit {
  responses: any[] = [];
  filteredResponses: any[] = [];
  enquetes: any[] = [];
  openResponseId: string | null = null; 
  questionsByResponse: { [responseId: string]: QuestionData[] } = {};
  searchTerm: string = '';

  constructor(
    private responseService: ResponseService,
    private enqueteService: EnqueteService,
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {
    forkJoin({
      enquetes: this.enqueteService.getEnquetes().pipe(
        map((enq: any[]) => enq.map(e => ({ id: e.id_enquete, titre: e.enquete_name || e.titre }))),
        catchError(() => of([]))
      ),
      responses: this.responseService.getAllResponses().pipe(catchError(() => of([])))
    }).subscribe(({ enquetes, responses }) => {
      this.enquetes = enquetes;
      this.responses = responses.sort((a,b) => +new Date(b.created_at) - +new Date(a.created_at));
      this.filteredResponses = [...this.responses]; // initialement tout afficher
    });
  }

  getEnqueteTitre(id_enquete: string): string {
    const enquete = this.enquetes.find(e => e.id === id_enquete);
    return enquete ? enquete.titre : 'N/A';
  }

  toggleResponse(response: any) {
    if (this.openResponseId === response.id) {
      this.openResponseId = null;
    } else {
      this.openResponseId = response.id;
      if (!this.questionsByResponse[response.id]) {
        this.questionService.getQuestionsByEnquete(response.id_enquete).subscribe({
          next: (questions) => this.questionsByResponse[response.id] = questions,
          error: (err) => console.error('Erreur questions:', err)
        });
      }
    }
  }

  isOpen(responseId: string): boolean {
    return this.openResponseId === responseId;
  }

  getAnswerValue(response: any, questionId: string): string {
    if (!response.answers) return 'N/A';
    const ans = response.answers.find((a: any) => a.id_question === questionId);
    return ans?.value ?? 'N/A';
  }

  filterResponses() {
    const term = this.searchTerm.toLowerCase();
    if (!term) {
      this.filteredResponses = [...this.responses];
      return;
    }

    this.filteredResponses = this.responses.filter(r => {
      const enqueteName = this.getEnqueteTitre(r.id_enquete).toLowerCase();
      const email = r.email.toLowerCase();
      return enqueteName.includes(term) || email.includes(term);
    });
  }
}
