export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}


export interface CreateTaskDto {
  title: string;
  description?: string;
  assignedTo?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assignedTo?: string;
}

export interface  GetAllTask{
    _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignedTo?: TaskUser;
  createdBy: TaskUser;
  createdAt: string;
  updatedAt: string;
}
export interface TaskUser{
  _id:string;
  username:string;
  email:string;
  role:string
  reportsTo:string
}

export  interface TaskResponse{
  success:boolean,
  data:GetAllTask[]
}
