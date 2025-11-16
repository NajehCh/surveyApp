import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavBar } from './components/navBar/navBar';
import { SideBar } from './components/sideBar/sideBar';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone:true,
  imports: [CommonModule, RouterOutlet,SideBar,NavBar,HttpClientModule,FontAwesomeModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  constructor( private authService: AuthService){}
  protected readonly title = signal('backoffice');
  get isLoggedIn(): boolean {
    return !!this.authService.getToken();
  }
}

