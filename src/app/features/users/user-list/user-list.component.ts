import { Component } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { Subject, takeUntil } from 'rxjs';
import { User, UserRole } from '../../../core/models/user';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, UpperCasePipe],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
UserRole=UserRole
public users$ = this.userService.userList$;
constructor(private router: Router,private userService :UserService) {}

private allUsers: User[] = [];

  // Array bound to the *ngFor loop in your template
  public filteredUsers: User[] = [];

  // Active filter states
  private searchQuery: string = '';
  private selectedRole: string = 'all';

  // Clean subscription management
  private destroy$ = new Subject<void>();



  ngOnInit(): void {
    // Subscribe to the behavior subject to get immediate updates whenever it shifts
    this.userService.userList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.allUsers = users;
        this.applyFilters();
      });
  }

  /**
   * Captures changes in the search input box.
   */
  public onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery = inputElement.value.toLowerCase().trim();
    this.applyFilters();
  }

  /**
   * Captures changes in the Role filter dropdown menu.
   */
  public onRoleFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedRole = selectElement.value;
    this.applyFilters();
  }

  /**
   * Combines both search and role criteria to derive the visible data set.
   */
  private applyFilters(): void {
    this.filteredUsers = this.allUsers.filter((user) => {
      // 1. Evaluate Search Query matching (Checks against username and email)
      const matchesSearch =
        !this.searchQuery ||
        user.username.toLowerCase().includes(this.searchQuery) ||
        user.email.toLowerCase().includes(this.searchQuery);

      // 2. Evaluate Role matches (Normalized comparison to accommodate case differences)
      const matchesRole =
        this.selectedRole === 'all' ||
        user.role.toLowerCase() === this.selectedRole.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }

  /**
   * Handles action button triggering for user updates
   */
  public onEditUser(user: User): void {
    console.log('Initiating editing flow for user context:', user);
    // TODO: Wire open a modal framework or redirect to a route payload: `this.router.navigate(['/users/edit', user._id])`
  }

  /**
   * Handles action button triggering for user eviction
   */
  public onDeleteUser(userId: string): void {
    if (confirm('Are you absolute in deleting this user configuration?')) {
      console.log('Sending eviction signal for user targeting ID:', userId);
      // TODO: Wire up to an explicit invocation: `this.userService.deleteUser(userId).subscribe(...)`
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
