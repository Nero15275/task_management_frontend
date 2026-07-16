import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent {
  taskForm!: FormGroup;
currentUserRole: any;
assignableUsers: any;
  constructor(private fb: FormBuilder) {}
  ngOnInit() {
   this.createForm();
  } 
  createForm() {
    this.taskForm = this.fb.group({
      title: [''],
      description: [''],
      dueDate: [''],
      priority: ['']
    });
  } 

onSubmit() {
throw new Error('Method not implemented.');
}
onCancel() {
throw new Error('Method not implemented.');
}
isEditMode: any;


}
