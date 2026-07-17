import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { catchError, exhaustMap, of, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
 loginForm!: FormGroup;
 private loginAction$ = new Subject<any>();

  
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder,private authService: AuthService,private router: Router) {

    this.loginAction$.pipe(
      
      takeUntilDestroyed(), 
      
      exhaustMap(credentials => {
        this.isLoading = true;
        this.errorMessage = '';
        
        return this.authService.login(credentials).pipe(
          
          catchError(err => {
            this.errorMessage = err.error?.message || 'Login failed. Please try again.';
            this.isLoading = false;
            return of(null);
          })
        );
      })
    ).subscribe((response) => {
      if (response) {
        this.isLoading = false;
        // Success! Redirect to dashboard, etc.
        console.log('Logged in successfully', response);
        this.router.navigateByUrl('/')
      }
    });
  }

  ngOnInit() {
    this.createForm();

  
  }
    createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
   
  onSubmit() {
    if (this.loginForm.valid) {
      this.loginAction$.next(this.loginForm.value);
    }
  } 
}
