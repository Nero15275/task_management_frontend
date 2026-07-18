import { ToastService } from './../../../core/services/toast.service';
import { Component } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { Subject, takeUntil } from 'rxjs';
import { User, UserRole } from '../../../core/models/user';
import { StorageService } from '../../../core/services/storage.service';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, UpperCasePipe],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  UserRole = UserRole;
  users$ = this.userService.userList$;

  private allUsers: User[] = [];


  filteredUsers: User[] = [];


  private searchQuery: string = '';
  private selectedRole: string = 'all';

  private destroy$ = new Subject<void>();
  currrentUser: any;

  constructor(
    private router: Router,
    private userService: UserService,
    private storageService: StorageService,
    private dialogService:DialogService,
    private toastService : ToastService
  ) {}

  ngOnInit(): void {
    this.getInitData();
    this.userService.userList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.allUsers = users;
        this.applyFilters();
      });
  }

  getInitData() {
    this.currrentUser = this.storageService.getUser();
    if (
      this.currrentUser.role != UserRole.Manager &&
      this.currrentUser.role != UserRole.SUPER_ADMIN
    ) {
      this.userService
        .loadReportingUsers()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (users) =>
            console.log('Successfully loaded and flattened users:', users),
          error: (err) => console.error('Failed to load reporting users:', err),
        });
    } else if (this.currrentUser.role == UserRole.SUPER_ADMIN) {
      this.userService
        .getManagers()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (users) =>
            console.log('Successfully loaded and flattened users:', users),
          error: (err) => console.error('Failed to load managers:', err),
        });
    } else {
      this.userService
        .getAllUsers()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (users) =>
            console.log('Successfully loaded and flattened users:', users),
          error: (err) => console.error('Failed to load all users:', err),
        });
    }
  }

  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery = inputElement.value.toLowerCase().trim();
    this.applyFilters();
  }

  onRoleFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedRole = selectElement.value;
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredUsers = this.allUsers.filter((user) => {
      const matchesSearch =
        !this.searchQuery ||
        user.username.toLowerCase().includes(this.searchQuery) ||
        user.email.toLowerCase().includes(this.searchQuery);

      const matchesRole =
        this.selectedRole === 'all' ||
        user.role.toLowerCase() === this.selectedRole.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }

  onCreateUser() {
    this.userService.setUserForEdit(null);
    this.router.navigate(['users/manage']);
  }

  onEditUser(user: User): void {
    this.userService.setUserForEdit(user);
    this.router.navigate(['users/manage']);
  }

  onDeleteUser(userId: string): void {
    this.dialogService.confirm('Are you sure in deleting this user configuration?',()=>{

      this.userService.deleteUser(userId).subscribe({
        next: (data:any) => {
          this.toastService.success('',data.message);
          this.getInitData();
        },
        error: (err) => {
          this.toastService.error('',err.message);
        },
      });
    })


  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
