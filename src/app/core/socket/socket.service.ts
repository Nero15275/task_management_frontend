import { inject, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, fromEvent } from 'rxjs';

import { environment } from '../../../environments/environment';

import { StorageService } from '../services/storage.service';

import { SocketEvents } from './socket.constants';

import {
  TaskCreatedEvent,
  TaskUpdatedEvent,
  TaskDeletedEvent,
} from './socket.types';
import { APP_CONFIG } from '../config/app.config.token';

@Injectable({
  providedIn: 'root',
})
export class SocketService {

private config = inject(APP_CONFIG);

  private socket?: Socket;

  constructor(private storageService: StorageService) {}

  connect(): void {
    const token = this.storageService.getToken();

    if (!token) {
      return;
    }

    this.socket = io(this.config.socketUrl, {
      transports: ['websocket'],
      auth: {
        token,
      },
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
  }

  onTaskCreated(): Observable<TaskCreatedEvent> {
    return fromEvent<TaskCreatedEvent>(
      this.socket!,
      SocketEvents.TASK_CREATED
    );
  }

  onTaskUpdated(): Observable<TaskUpdatedEvent> {
    return fromEvent<TaskUpdatedEvent>(
      this.socket!,
      SocketEvents.TASK_UPDATED
    );
  }

  onTaskDeleted(): Observable<TaskDeletedEvent> {
    return fromEvent<TaskDeletedEvent>(
      this.socket!,
      SocketEvents.TASK_DELETED
    );
  }
}
