import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { EmailService } from '../../services/email.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { EnqueteService } from '../../services/enquete.service';
import { EmailData, EnqueteData } from '../../types';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash,faX,faEdit,faPlusCircle,faEnvelope,faSquare,faSquareCheck,faUser } from '@fortawesome/free-solid-svg-icons';
import { error } from 'console';

@Component({
  selector: 'app-email',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule, FormsModule,HttpClientModule],
  templateUrl: './email.html',
  styleUrls: ['./email.css'],
})
export class Email implements OnInit {
  emailsSubject = new BehaviorSubject<EmailData[]>([]);
  emails$ = this.emailsSubject.asObservable();
  
  isLoading = true;
  editingEmail: EmailData | null = null;


  newEmail: Partial<EmailData> = {};
  modalEmail: Partial<EmailData> | null = null;


  selectAllChecked = false;
  sendModalOpen = false;
  faPlus=faPlusCircle;
  faEnvelope=faEnvelope
  faUser=faUser
  faSquare=faSquare
  faTrash=faTrash
  faEdit=faEdit
  faSquareCheck=faSquareCheck
  faX=faX


selectedEnqueteId: string = '';
selectedEmails: string[] = [];
emailsToSend: string[] = [];

  private enquetesSubject = new BehaviorSubject<EnqueteData[]>([]);
  enquetes$ = this.enquetesSubject.asObservable();
  constructor(private emailService: EmailService,    private enqueteService: EnqueteService ) {}

  ngOnInit(): void {
    this.loadEmails();
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
// Méthode pour charger les enquêtes depuis l'API
loadEnquetes() {
  this.enqueteService.getEnquetes().subscribe({
    next: (data) => {
      const enqs = (Array.isArray(data) ? data : data || [])
        .filter((e: EnqueteData) => e.status === 'active'); // filtre actif uniquement
      this.enquetesSubject.next(enqs);
      console.log("Enquêtes actives :", enqs);
    },
    error: (err) => console.error('Erreur de chargement des enquêtes', err)
  });
}


// Ouvrir modal
openModal(email?: EmailData) {
  if (email) {
    this.modalEmail = { ...email }; // Edition
  } else {
    this.modalEmail = { email: '', createdAt: new Date() }; // Ajout
  }
}

  
// Fermer modal
closeModal() {
  this.modalEmail = null;
}
  

  editEmail(email: EmailData) {
    this.editingEmail = { ...email }; // copie locale
  }


// Sauvegarder (Ajout ou Edition)
saveModal() {
  if (!this.modalEmail?.email) {
    alert('Email obligatoire');
    return;
  }


  
  if (this.modalEmail.id_email) {
    // Edition
    const current = this.emailsSubject.value;
    this.emailService.updateEmail(this.modalEmail.id_email,{ email: this.modalEmail.email }).subscribe({
      next: (res) => {
        this.emailsSubject.next(
          current.map((e) => (e.id_email === this.modalEmail!.id_email ? this.modalEmail as EmailData : e))
        );
        this.closeModal();
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Erreur lors de l’ajout de l’email');
      }
    });
    
  } else {
    // Ajout → backend
    this.emailService.createEmail({ email: this.modalEmail.email }).subscribe({
      next: (res) => {
        // ⚡ Forcer id_email défini et createdAt
        const result: EmailData = { 
          ...res, 
          id_email: res.id_email ?? Date.now().toString(), 
          createdAt: res.createdAt ? new Date(res.createdAt) : new Date() 
        };
        this.emailsSubject.next([...this.emailsSubject.value, result]);
        this.closeModal();
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Erreur lors de l’ajout de l’email');
      }
    });
  }

  this.closeModal();
}




  deleteEmail(id_email: string) {
    console.log(id_email)
    this.emailService.deleteEmail(id_email).subscribe({
      next:(res)=>{
        const current = this.emailsSubject.value;
        this.emailsSubject.next(current.filter((e) => e.id_email !== id_email));      
    },
    error: (err) => {
      console.error(err);
      alert(err.error?.message || 'Erreur lors de l’ajout de l’email'); 
    }}
  )
  }
  // basculer sélection d’un email
toggleSelection(email: string) {
  if (this.selectedEmails.includes(email)) {
    this.selectedEmails = this.selectedEmails.filter(i => i !== email);
  } else {
    this.selectedEmails.push(email);
  }

  // mettre à jour la checkbox "select all"
  const allIds = this.emailsSubject.value.map(e => e.email);
  this.selectAllChecked = this.selectedEmails.length === allIds.length;
}

// cocher/décocher tout via checkbox
toggleSelectAll(event: any) {
  this.selectAllChecked = event.target.checked;
  if (this.selectAllChecked) {
    this.selectedEmails = this.emailsSubject.value.map(e => e.email);
  } else {
    this.selectedEmails = [];
  }
}
openSendModal() {
  console.log("hh")
  this.emailsToSend = [...this.selectedEmails]; // pré-rempli
  this.sendModalOpen = true;
}

closeSendModal() {
  this.sendModalOpen = false;
}




sendEmails() {
  if (this.emailsToSend.length === 0 || !this.selectedEnqueteId) {
    alert("Veuillez choisir des emails et un id d'enquête.");
    return;
  }

  const payload = {
    emails: this.emailsToSend,
    id_enquete: this.selectedEnqueteId
  };
  console.log(payload)
  this.emailService.sendEmail({emails:payload.emails,id_enquete:payload.id_enquete}).subscribe({
    next:(res)=>{
      console.log(res)
    },error:(err)=>{
      console.error(err);
      alert(err.error?.message || 'Erreur lors de send de l’email');
    }
  })
  }
  toggleSelectAllFromButton() {
    this.selectAllChecked = !this.selectAllChecked;
    if (this.selectAllChecked) {
      this.selectedEmails = this.emailsSubject.value.map(e => e.email);
    } else {
      this.selectedEmails = [];
    }
  }

  // Ajouter un email (doublon)
addEmail(email: string) {
  this.emailsToSend.push(email);
}

// Supprimer un email par index
removeEmail(index: number) {
  console.log(this.emailsToSend.splice(index, 1));
}

}
