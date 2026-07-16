import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
onCancel() {
throw new Error('Method not implemented.');
}
  userForm!: FormGroup;
  isEditMode: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.userForm = this.fb.group({
      username: [''],
      email: [''],
      role: ['']
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      // Handle form submission logic here
    }
  } 

}
