import { Component } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { Home } from '../../pages/home/home';
import { EnqueteModal } from '../../modal/enquete_modal/enquete.model'; 
import { LogoutService } from '../../auth/logout/logout';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

export const routes: Routes = [
  { path: '', component: Home }
];

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [EnqueteModal, CommonModule],
  templateUrl: './navBar.html',
  styleUrls: ['./navBar.css'] // correction ici
})
export class NavBar {
  modalOpen = false;
  searchQuery: string = '';

  constructor(
    private authService: AuthService,
    private logoutService: LogoutService,
    private router: Router
  ) {}

  openModal() {
    this.modalOpen = true; // ouvre la modal pour créer une nouvelle enquête
  }

  closeModal() {
    this.modalOpen = false;
  }

  get isLoggedIn(): boolean {
    return !!this.authService.getToken();
  }

  logout() {
    this.logoutService.logout();
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  onSearchChange() {
    console.log('Recherche en cours:', this.searchQuery);
    // Émettre un événement vers le parent si nécessaire
  }
}
