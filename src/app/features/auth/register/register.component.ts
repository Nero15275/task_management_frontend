import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
registerForm!: FormGroup;
  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.registerForm = this.fb.group({
      username: [''],
      email: [''],
      password: ['']
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      // Handle registration logic here
    }
  }

}
