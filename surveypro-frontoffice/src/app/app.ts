import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NavBar } from './component/navBar/navBar';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet,NavBar, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('survey');
}
