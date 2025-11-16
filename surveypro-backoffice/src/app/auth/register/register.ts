import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone:true,
  imports:[ReactiveFormsModule,CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]

    }, {
      validator: this.passwordMatchValidator
    });
  }
 //Password icon
 togglePassword(): void {
  this.showPassword = !this.showPassword;
}
  // Validator pour vérifier que le mot de passe et la confirmation correspondent
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Getter pour accéder facilement aux champs
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    console.log('Form Data:', this.registerForm.value);
    // Ici vous pouvez appeler votre service pour enregistrer l'utilisateur
    // Exemple : this.authService.register(this.registerForm.value).subscribe(...);

    alert('Inscription réussie !');
    this.router.navigate(['/login']); // rediriger vers login après inscription
  }

  goLogin(){
    this.router.navigate(['/login']);

  }
}
