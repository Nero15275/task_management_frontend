import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';
import { StorageService } from '../../core/services/storage.service';
import { User, UserRole } from '../../core/models/user';
import { CommonModule } from '@angular/common';
import { UserService } from '../../features/users/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TaskService } from '../../features/tasks/task.service';
import { GetAllTask } from '../../core/models/task';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
})
export class DashboardLayoutComponent {
  currrentUser!: User;
  currentUserRole!: string | null;
  userRole = UserRole;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private userService: UserService,
    private router: Router,
  ) {
    this.currrentUser = this.storageService.getUser();


  }

  ngOnInit() {}

  viewProfile() {
    this.router.navigate(['profile'])
  }

  logout() {
    this.authService.logout();
  }
}
