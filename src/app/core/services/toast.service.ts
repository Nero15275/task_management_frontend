import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private message: MessageService) {}

  success(summary: string, detail: string) {
    this.message.add({
      severity: 'success',
      summary,
      detail
    });
  }

  error(summary: string, detail: string) {
    this.message.add({
      severity: 'error',
      summary,
      detail
    });
  }

  warning(summary: string, detail: string) {
    this.message.add({
      severity: 'warn',
      summary,
      detail
    });
  }

  info(summary: string, detail: string) {
    this.message.add({
      severity: 'info',
      summary,
      detail
    });
  }

  clear() {
    this.message.clear();
  }
}
