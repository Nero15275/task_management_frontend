import { Component } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, UpperCasePipe],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {

constructor(private router: Router) {}

onDeleteUser(arg0: any) {
throw new Error('Method not implemented.');
}
onEditUser(_t25: any) {
 this.router.navigate(['/createEditusers', _t25.id]);
}
  filteredUsers: any[] = [];
onRoleFilterChange($event: Event) {
throw new Error('Method not implemented.');
}
onSearch($event: any) {
throw new Error('Method not implemented.');
}

}
