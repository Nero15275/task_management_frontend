import { SocketService } from './../../../core/socket/socket.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../core/services/storage.service';
import { User, UserRole } from '../../../core/models/user';
import { TaskService } from '../task.service';
import {
  GetAllTask,
  Task,
  TaskStatus,
  UpdateTaskDto,
} from '../../../core/models/task';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { merge, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  currentUser!: User;
  filteredTasks: GetAllTask[] = [];
  TaskStatus = TaskStatus;
  backUpTask: GetAllTask[] = [];
  activeFilter: string = 'ALL';
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private storageService: StorageService,
    private taskSevice: TaskService,
    private dialogService: DialogService,
    private toastService:ToastService,
    private socketService:SocketService
  ) {}
  ngOnInit() {
    this.currentUser = this.storageService.getUser();
    this.getAllTasks();
        merge(

        this.socketService.onTaskCreated(),

        this.socketService.onTaskUpdated(),

        this.socketService.onTaskDeleted()

    )
    .pipe(takeUntil(this.destroy$))
    .subscribe((event) => {

        // Delete Event
  if ('taskId' in event) {

    this.backUpTask = this.backUpTask.filter(
      task => task._id !== event.taskId
    );

  } else {

    // Create
    const index = this.backUpTask.findIndex(
      task => task._id === event._id
    );

    if (index === -1) {

      this.backUpTask = [
        event,
        ...this.backUpTask,
      ];

    } else {

      // Update
      this.backUpTask[index] = event;

      // Trigger change detection
      this.backUpTask = [...this.backUpTask];
    }
  }

  this.applyFilter();


    });

  }
  getAllTasks() {
    this.taskSevice.getTasks().subscribe({
      next: (res) => {
        this.backUpTask = res.data;
        this.applyFilter();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  canUserDeleteTask(task: any): boolean {
    if (!this.currentUser) return false;

    const role = this.currentUser?.role;
    const userId = this.currentUser?._id;

    switch (role) {
      case UserRole.Manager:
        return true;

      case UserRole.TeamLead:
        return task.createdBy._id === userId || task.assignedTo._id === userId;

      case UserRole.Employee:
        return task.createdBy._id === userId;

      default:
        return false;
    }
  }

  onDelete(task: GetAllTask) {
    this.dialogService.confirm(
      `Are you absolute in deleting ${task.title} ?`,
      () => {
        this.taskSevice.deleteTask(task._id).subscribe({
          next: (res) => {
            this.toastService.success('',res.message);
            this.getAllTasks();
          },
          error: (err) => {
            console.log(err);
            this.toastService.error('',err.message);
          },
        });
      },
    );
  }
  onEdit(task: any) {
    this.taskSevice.setTaskObject(task);
    this.router.navigate(['/tasks/manage/']);
  }
  onMarkComplete(task: GetAllTask) {
    let payload = {
      status: TaskStatus.COMPLETED,
    };
    this.taskSevice.updateTask(task._id, payload).subscribe({
      next: (res:any) => {
        this.toastService.success('','Task Compleated');
        this.getAllTasks();
      },
      error: (err) => {
        console.log(err);
        this.toastService.error('','something went wrong');
      },
    });
  }
  changeFilter(arg0: string) {
    this.activeFilter = arg0;

    this.applyFilter();
  }

  private applyFilter(): void {
  if (this.activeFilter === 'ALL') {
    this.filteredTasks = [...this.backUpTask];
    return;
  }

  this.filteredTasks = this.backUpTask.filter(
    task => task.status === this.activeFilter
  );
}


  createTask() {
    this.taskSevice.setTaskObject({} as GetAllTask);
    this.router.navigate(['tasks/manage']);
  }

  ngOnDestroy() {

    this.destroy$.next();

    this.destroy$.complete();

}
}
