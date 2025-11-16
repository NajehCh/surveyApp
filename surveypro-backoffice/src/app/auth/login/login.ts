import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { EnqueteData, EnqueteState} from '../../types';
import {AuthService} from "../../services/auth.service"
import { EnqueteService } from '../../services/enquete.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})


export class Login {

  loginForm: FormGroup;
  showPassword: boolean = false;
  isLoading: boolean = false;


  constructor(
    private fb: FormBuilder, 
    private router: Router ,
    private authService: AuthService,
    private enqueteService : EnqueteService
  ) {
    //Initialisation du formulaire
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
   
  //Password icon
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }






  onSubmit(): void   {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.authService.login(this.loginForm.value.email,this.loginForm.value.password)
      .subscribe({
        next: (res: any) => { 
          if (typeof window !== 'undefined') {
            localStorage.setItem('token',res.access_token);
          }
          this.router.navigate(['/home']); 
          this.loginForm.reset();
        },
        error: (err) => {
          alert(err.error.message);
        },

        complete: () => {
          this.isLoading = false;
          this.showPassword = false;
        }
      });
  }
  goRegister(){
    this.router.navigate(['/register']);

  }
  
}








