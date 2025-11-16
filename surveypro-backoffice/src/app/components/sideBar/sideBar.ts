import { Component, Input } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { LogoutService } from '../../auth/logout/logout';
import { EnqueteModal } from '../../modal/enquete_modal/enquete.model';

@Component({
  selector: 'app-side-bar',
  imports: [EnqueteModal, CommonModule],
  templateUrl: './sideBar.html',
  styleUrls: ['./sideBar.css']
})
export class SideBar{
  modalOpen = false;

  @Input() isResponseMode: boolean = false; 
  constructor(public router: Router,private authService: AuthService,private logoutService: LogoutService,
     ) {} 
     logout() {
      this.logoutService.logout();
    }
    openModal() {
      this.modalOpen = true; // ouvre la modal pour créer une nouvelle enquête
    }
  
    closeModal() {
      this.modalOpen = false;
    }
    get isLoggedIn(): boolean {
      return !!this.authService.getToken();
    }
}
