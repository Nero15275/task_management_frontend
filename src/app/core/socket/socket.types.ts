import { GetAllTask } from "../models/task";


export interface TaskDeletedEvent {
  taskId: string;
}

export type TaskCreatedEvent = GetAllTask;

export type TaskUpdatedEvent = GetAllTask;
