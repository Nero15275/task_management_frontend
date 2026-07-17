import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserRole } from '../../../core/models/user';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { catchError, exhaustMap, of, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
registerForm!: FormGroup;

 loginForm!: FormGroup;
 private registerAction$ = new Subject<any>();


  isLoading = false;
  errorMessage = '';
  constructor(private fb: FormBuilder,private authService: AuthService,private router: Router) {

        this.registerAction$.pipe(
          
          takeUntilDestroyed(), 
          
          exhaustMap(credentials => {
            this.isLoading = true;
            this.errorMessage = '';
            
            return this.authService.register(credentials).pipe(
              
              catchError(err => {
                this.errorMessage = err.error?.message || 'registration failed. Please try again.';
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
    this.registerForm = this.fb.group({
      username: ['',[Validators.required]],
      email: ['',[Validators.email,Validators.required]],
      password: ['',[Validators.required,Validators.minLength(8)]],
      role:[UserRole.Employee]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.registerAction$.next(this.registerForm.value)
    }
  }

}
