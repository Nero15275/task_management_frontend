import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  constructor(private router: Router) {}

onDelete(arg0: any) {
throw new Error('Method not implemented.');
}
onEdit(_t13: any) {
 this.router.navigate(['/createEdittasks', _t13.id]);
}
onMarkComplete(_t13: any) {
throw new Error('Method not implemented.');
}
changeFilter(arg0: string) {
throw new Error('Method not implemented.');
}
activeFilter: any;

}
