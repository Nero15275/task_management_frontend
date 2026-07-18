import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../core/services/storage.service';
import { User, UserRole } from '../../../core/models/user';
import { TaskService } from '../task.service';
import { GetAllTask, Task ,TaskStatus, UpdateTaskDto } from '../../../core/models/task';


@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [DatePipe,CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  currentUser!: User;
  filteredTasks:GetAllTask[]=[];
  TaskStatus= TaskStatus;
  backUpTask: GetAllTask[]=[];
  activeFilter: string ="ALL";


  constructor(private router: Router,private storageService: StorageService,private taskSevice:TaskService) {}
  ngOnInit(){
    this.currentUser = this.storageService.getUser();
    this.getAllTasks()
  }
  getAllTasks(){
    this.taskSevice.getTasks().subscribe(
      {next:(res)=>{
        this.filteredTasks=res.data;
        this.backUpTask =res.data;
      },
      error:(err)=>{
        console.log(err);
      }
    });
  }


  canUserDeleteTask(task: any): boolean {
    if (!this.currentUser) return false;

    const role = this.currentUser?.role;
    const userId = this.currentUser?._id

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
  if(confirm(`Do you really want to delete ${task.title}`))
this.taskSevice.deleteTask(task._id).subscribe({
  next:(res)=>{
    this.getAllTasks()
  },
  error:(err)=>{
    console.log(err);

  }
})
}
onEdit(task: any) {
 this.taskSevice.setTaskObject(task)
 this.router.navigate(['/tasks/manage/']);
}
onMarkComplete(task:GetAllTask ) {
  let payload={
    "status":TaskStatus.COMPLETED
  }
this.taskSevice.updateTask(task._id,payload).subscribe({
  next:(res)=>{
    this.getAllTasks()
  },
  error:(err)=>{
    console.log(err);

  }
})
}
changeFilter(arg0: string) {
  this.activeFilter=arg0
if(arg0==="ALL"){
  this.filteredTasks=this.backUpTask
}else{
  this.filteredTasks=this.backUpTask.filter((task)=>task.status===arg0)
}
}


 createTask() {
    this.taskSevice.setTaskObject({} as GetAllTask)
    this.router.navigate(['tasks/manage'])
  }

}
