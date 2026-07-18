import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CreateTaskDto, GetAllTask, Task, TaskResponse, UpdateTaskDto } from '../../core/models/task';
import { APP_CONFIG } from 'src/app/core/config/app.config.token';



@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private config = inject(APP_CONFIG);
  private readonly tasksUrl = `${this.config.apiUrl}v1/tasks`;


  private readonly taskObjectSubject = new BehaviorSubject<GetAllTask>({} as GetAllTask);


  public readonly taskObject$: Observable<GetAllTask> = this.taskObjectSubject.asObservable();


  constructor(private http: HttpClient) {}


  createTask(taskData: Partial<CreateTaskDto>): Observable<CreateTaskDto> {
    return this.http.post<CreateTaskDto>(this.tasksUrl, taskData);
  }

  getTasks(): Observable<TaskResponse>{
    return this.http.get<TaskResponse>(this.tasksUrl);
  }


  updateTask(id: string, taskData: Partial<UpdateTaskDto>): Observable<UpdateTaskDto> {
    return this.http.patch<UpdateTaskDto>(`${this.tasksUrl}/${id}`, taskData);
  }


  deleteTask(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.tasksUrl}/${id}`);
  }


   public get getTaskObject(): GetAllTask {
      return this.taskObjectSubject.getValue();
    }

    public setTaskObject(value:GetAllTask){
       this.taskObjectSubject.next(value);
    }
}
