import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EnqueteData, EnqueteStatus } from '../../types';
import { Router } from '@angular/router';
import { faTrash, faUser, faClock,faCalendar, faEdit, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-enquete-item',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule],
  templateUrl: './enquete-item.html',
  providers: [DatePipe],  
  styleUrls: ['./enquete-item.css'],
})
export class EnqueteItem {
  constructor (private router:Router){}
  @Input() enquete!: EnqueteData;
  faUser = faUser;
  faCalendar = faCalendar;
  faClock = faClock


  getStatusClasses(status: EnqueteStatus): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'closed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  }
  

  getStatusText(status: EnqueteStatus): string {
    switch (status) {
      case 'active': return 'Active';
      case 'draft': return 'draft';
      case 'closed': return 'closed';
      default: return status;
    }
  }

  goEnquete(id_enquete:string) {
    this.router.navigate([`/enquetes/${id_enquete}`]);
  }

  getFirstWords(text: string, wordCount: number = 6): string {
    if (!text) return '';
    const words = text.split(' ');
    return words.slice(0, wordCount).join(' ') + (words.length > wordCount ? '...' : '');
  }
}
