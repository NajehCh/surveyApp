import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnqueteItem } from '../../components/enquete-item/enquete-item';
import { EnqueteService } from '../../services/enquete.service';
import { AuthService } from '../../services/auth.service';
import { EmailData, EnqueteData } from '../../types';
import { BehaviorSubject } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { response } from 'express';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule, EnqueteItem],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})

export class Home implements OnInit {
  isLoading=false
  // ✅ Créer un BehaviorSubject pour stocker les enquêtes
  private enquetesSubject = new BehaviorSubject<EnqueteData[]>([]);

  // ✅ Exposer un Observable pour le template avec | async
  enquetes$ = this.enquetesSubject.asObservable();
  responsesCount: number = 0;
  activeCount = 0;
  draftCount = 0;
  faUser=faUser
  private weekDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
  responses: any[] = []; // tableau complet des réponses
  emailsSubject = new BehaviorSubject<EmailData[]>([]);
  emails$ = this.emailsSubject.asObservable();
  constructor(
    private enqueteService: EnqueteService,
    private emailService:EmailService
  ) {}

  ngOnInit() {
    this.loadEnquetes();
    this.loadEmails();
    this.enqueteService.getEnqueteResponses().subscribe({
      next: (responses) => {
        this.responses = responses; // stocker la liste
        this.responsesCount = responses.length;
      },
      error: (err) => console.error(err)
    });
  }

  // Méthode pour charger les enquêtes depuis l'API
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

  // Rafraîchir manuellement
  refresh() {
    this.loadEnquetes();
  }
  private loadEmails() {
    this.isLoading = true;
    this.emailService.getEmail().subscribe({
      next: (data:any) => {
        this.emailsSubject.next(data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur récupération emails:', err);
        this.emailsSubject.next([]);
        this.isLoading = false;
      },
    });
  }
  getActiveCount(enquetes: EnqueteData[] | null): number {
    return enquetes ? enquetes.filter(e => e.status === 'active').length : 0;
  }
  getDraftCount(enquetes: EnqueteData[] | null): number {
    return enquetes ? enquetes.filter(e => e.status === 'draft').length : 0;
  }
  getResponsesCount(): number {
    return this.responsesCount;
  }

  getNewSinceYesterday(): number {
    const enquetes = this.enquetesSubject.getValue();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
  
    return enquetes.filter(e => {
      // Vérifier que startDate n'est pas null
      if (!e.startDate) return false;
      return new Date(e.startDate) > yesterday;
    }).length;
  }
   isSameDay = (d1: Date, d2: Date): boolean => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };
   isSameMonth = (d: Date, ref: Date): boolean => {
    return d.getFullYear() === ref.getFullYear() &&
           d.getMonth() === ref.getMonth();
  };
  getMonthlyResponseRate(): number {
    const enquetes = this.enquetesSubject.getValue();
    const now = new Date();
  
    // 🔹 Enquêtes créées ce mois
    const thisMonthEnquetes = enquetes.filter(e => {
      if (!e.startDate) return false;
      const d = new Date(e.startDate);
      return d.getUTCFullYear() === now.getUTCFullYear() &&
             d.getUTCMonth() === now.getUTCMonth();
    });
  
    if (thisMonthEnquetes.length === 0) return 0;
  
    // 🔹 Enquêtes qui ont au moins 1 réponse ce mois
    const enquetesWithResponse = thisMonthEnquetes.filter(e =>
      this.responses.some(r => {
        if (!r.createdAt) return false;
        const d = new Date(r.createdAt);
        return d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        String(r.id_enquete) === String(e.id_enquete);
 
      })
    );
    // 🔹 Pourcentage d’enquêtes ayant reçu au moins 1 réponse
    return Math.round((enquetesWithResponse.length / thisMonthEnquetes.length) * 100);
  }
  // Méthode pour obtenir le pourcentage d'enquêtes en brouillon
getDraftPercentage(): number {
  const enquetes = this.enquetesSubject.getValue();
  if (!enquetes || enquetes.length === 0) return 0;

  const draftCount = enquetes.filter(e => e.status === 'draft').length;
  const totalCount = enquetes.length;

  return Math.round((draftCount / totalCount) * 100);
}
  // Méthode pour obtenir le pourcentage d'enquêtes actives
getActivePercentage(): number {
  const enquetes = this.enquetesSubject.getValue();
  if (!enquetes || enquetes.length === 0) return 0;

  const activeCount = enquetes.filter(e => e.status === 'active').length;
  const totalCount = enquetes.length;

  return Math.round((activeCount / totalCount) * 100);
}
// Méthode pour obtenir tous les emails sous forme de tableau de chaînes
getAllEmails(): string[] {

  return this.emailsSubject.value.map(e => e.email);
}

// Méthode pour obtenir le nombre total d’emails / utilisateurs
getTotalUsers(): number {
  return this.emailsSubject.value.length;
}
// 1️⃣ Obtenir les réponses cumulées par jour et dans l’ordre
getDailyResponses(): { day: string; count: number }[] {
  if (!this.responses || this.responses.length === 0) return [];

  // Comptage des réponses par jour
  const responsesByDay: Record<string, number> = {};
  this.responses.forEach(r => {
    const date = new Date(r.createdAt);
    const day = date.toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase();
    if (!responsesByDay[day]) responsesByDay[day] = 0;
    responsesByDay[day] += 1;
  });

  // Transformation en tableau avec ordre correct
  const daily = this.weekDays.map(day => ({
    day: day.charAt(0).toUpperCase() + day.slice(1), // première lettre majuscule
    count: responsesByDay[day] || 0
  }));

  return daily;
}

// 2️⃣ Calculer l'évolution quotidienne cumulée
getDailyEvolution(): { day: string; evolution: number }[] {
  const daily = this.getDailyResponses();
  let cumulative = 0;

  return daily.map(r => {
    cumulative += r.count; // cumul des réponses
    return { day: r.day, evolution: cumulative };
  });
}
getDailyResponseRateChange(): number {
  const now = new Date();
  const enquetes = this.enquetesSubject.getValue();
  if (!enquetes || enquetes.length === 0) return 0;

  // 🔹 Compter les enquêtes qui ont reçu des réponses aujourd’hui
  const todayResponses = this.responses.filter(r => {
    if (!r.createdAt) return false;
    const d = new Date(r.createdAt);
    return this.isSameDay(d, now);
  }).length;

  // 🔹 Compter les réponses d’hier
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const yesterdayResponses = this.responses.filter(r => {
    if (!r.createdAt) return false;
    const d = new Date(r.createdAt);
    return this.isSameDay(d, yesterday);
  }).length;

  // 🔹 Si aucune donnée hier → éviter division par zéro
  if (yesterdayResponses === 0) {
    return todayResponses > 0 ? 100 : 0;
  }

  // 🔹 Pourcentage de variation (par rapport à hier)
  return Math.round(((todayResponses - yesterdayResponses) / yesterdayResponses) * 100);
}

}
