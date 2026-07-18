import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private confirmation: ConfirmationService
  ) {}

  confirm(
    message: string,
    accept: () => void,
    reject?: () => void
  ) {
    this.confirmation.confirm({
      header: 'Confirmation',
      message,
      icon: 'pi pi-exclamation-triangle',
      accept,
      reject
    });
  }
}
