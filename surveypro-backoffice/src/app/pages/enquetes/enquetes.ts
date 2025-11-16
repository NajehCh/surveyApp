import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnqueteItem } from '../../components/enquete-item/enquete-item';
import { EnqueteService } from '../../services/enquete.service';
import { EnqueteData } from '../../types';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser,faCircleCheck,faBolt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-enquetes',
  imports: [CommonModule, FontAwesomeModule, EnqueteItem],
  templateUrl: './enquetes.html',
  styleUrls: ['./enquetes.css']
})
export class Enquetes implements OnInit {
  private enquetesSubject = new BehaviorSubject<EnqueteData[]>([]);
  private filterSubject = new BehaviorSubject<string>('all');
  private publishedMode = new BehaviorSubject<boolean>(false);

  enquetes$ = this.enquetesSubject.asObservable();

  // 👉 Combine filtre + mode "publiées"
  filteredEnquetes$ = combineLatest([
    this.enquetes$,
    this.filterSubject,
    this.publishedMode
  ]).pipe(
    map(([enquetes, filter, published]) => {
      if (published) {
        return enquetes.filter(e => e.isPublish === true);
      }
      if (filter === 'all') return enquetes;
      return enquetes.filter(e => e.status === filter);
    })
  );

  responsesCount: number = 0;
  activeCount = 0;
  draftCount = 0;
  faUser = faUser;
  faCircleCheck=faCircleCheck
  faBolt=faBolt
  constructor(private enqueteService: EnqueteService) {}

  ngOnInit() {
    this.loadEnquetes();
    this.enqueteService.getEnqueteResponses().subscribe({
      next: (responses) => (this.responsesCount = responses.length),
      error: (err) => console.error(err)
    });
  }

  loadEnquetes() {
    this.enqueteService.getEnquetes().subscribe({
      next: (data) => {
        const enqs = Array.isArray(data) ? data : data || [];
        this.enquetesSubject.next(enqs);
        this.activeCount = enqs.filter(e => e.status === 'active').length;
        this.draftCount = enqs.filter(e => e.status === 'draft').length;
      },
      error: (err) => console.error('Erreur de chargement', err)
    });
  }

  refresh() {
    this.loadEnquetes();
  }

  // 👉 filtre basé sur le status
  filterEnquetes(status: string) {
    this.publishedMode.next(false); // désactive mode publié
    this.filterSubject.next(status);
  }

  // 👉 filtre spécifique basé sur isPublish
  filterEnquetesPublished() {
    this.filterSubject.next('all'); // reset filtre status
    this.publishedMode.next(true);
  }
}
