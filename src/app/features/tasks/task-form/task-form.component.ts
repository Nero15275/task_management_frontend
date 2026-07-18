import { StorageService } from './../../../core/services/storage.service';
import { TaskService } from './../task.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GetAllTask, TaskStatus } from '../../../core/models/task';
import { UserService } from '../../users/user.service';
import { User, UserRole } from '../../../core/models/user';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent {
  taskForm!: FormGroup;
  currentUser: User;
  assignableUsers: User[];
  isEditMode: boolean = false;
  private destroy$ = new Subject<void>();
  taskObject: GetAllTask;
  taskStatus=[TaskStatus.PENDING,TaskStatus.IN_PROGRESS,TaskStatus.COMPLETED]
  UserRole=UserRole

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private userService: UserService,
    private storageService:StorageService,
    private router : Router,
    private toastService :ToastService
  ) {}
  ngOnInit() {
    this.createForm();
    this.getInitData()

  }
  getInitData(){
    this.currentUser=this.storageService.getUser()
     this.taskService.taskObject$
          .pipe(takeUntil(this.destroy$))
          .subscribe((task) => {
            this.taskObject = task;
            if(task?._id){
              this.isEditMode=true
              this.patchValue()
            }
          });

    this.userService
            .loadReportingUsers()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (users) =>
                console.log('Successfully loaded and flattened users:'),
              error: (err) => console.error('Failed to load reporting users:', err),
            });

     this.userService.userList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.assignableUsers = users;

      });
  }
  createForm() {
    this.taskForm = this.fb.group({
      title: [, [Validators.required, Validators.min(3), Validators.max(100)]],
      description: ['', [Validators.min(3), Validators.max(100)]],
      assignedTo: [''],
      status:['']
    });
  }
  patchValue(){
    this.taskForm.get('title').setValue(this.taskObject.title)
    this.taskForm.get('description').setValue(this.taskObject.description)
    this.taskForm.get('assignedTo').setValue(this.taskObject.assignedTo._id)
    if(this.currentUser._id===this.taskObject.assignedTo._id){
      this.taskForm.get('assignedTo').setValue('')
    }
    this.taskForm.get('status').setValue(this.taskObject.status)
  }

  onSubmit() {
    if (this.taskForm.valid) {
      if(this.isEditMode){
        if(!this.taskForm.get('assignedTo').value){
          this.taskForm.get('assignedTo').setValue(this.currentUser._id)
        }
        let payload = this.taskForm.getRawValue()
        if(this,this.currentUser.role===UserRole.Employee){
          const { assignedTo, ...cleanPayload } = payload;
          payload = cleanPayload;
        }
        this.taskService.updateTask(this.taskObject._id,payload).subscribe({
          next:(res:any)=>{
            this.toastService.success('','Task Updated');
          this.onCancel()
        },error:(err)=>{
          this.toastService.error('','something went wrong');
        }
      });
      }else{
        let payload:any={
        title:this.taskForm.get('title').value,
        description:this.taskForm.get('description').value
      }
      if(this.taskForm.get('assignedTo').value){
        payload.assignedTo=this.taskForm.get('assignedTo').value
      }
      this.taskService.createTask(payload).subscribe({
          next:(res:any)=>{
            this.toastService.success('','Task created');
          this.onCancel()
        },error:(err)=>{

          this.toastService.error('','something went wrong');
        }
      });
      }
    }
  }
  onCancel() {
    this.taskService.setTaskObject(null)
    this.router.navigate(['task'])
  }

    ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
