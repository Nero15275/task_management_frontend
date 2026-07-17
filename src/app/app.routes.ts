import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/role/role.guard';
import { UserRole } from './core/models/user'; // Adjust path if necessary

import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Login - Task Manager',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    title: 'Register - Task Manager',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },

  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      // {
      //   path: '',
      //   pathMatch: 'full',
      //   title: 'Dashboard',
      //   loadComponent: () =>
      //     import('./features/dashboard/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      // },

      {
        path:'',
        pathMatch:'full',
        redirectTo:'tasks'
      },
      {
        path: 'users',
        title: 'Users List',
        canActivate: [roleGuard],
        data: { expectedRoles: [UserRole.Manager, UserRole.TeamLead] },
        loadComponent: () =>
          import('./features/users/user-list/user-list.component').then((m) => m.UserListComponent),
      },
      {
        path: 'users/manage',
        title: 'Manage User',
        canActivate: [roleGuard],
        data: { expectedRoles: [UserRole.Manager] }, // Only managers can create new base users
        loadComponent: () =>
          import('./features/users/user-form/user-form.component').then((m) => m.UserFormComponent),
      },
      {
        path: 'users/manage/:id',
        title: 'Edit User',
        canActivate: [roleGuard],
        data: { expectedRoles: [UserRole.Manager, UserRole.TeamLead] },
        loadComponent: () =>
          import('./features/users/user-form/user-form.component').then((m) => m.UserFormComponent),
      },


      {
        path: 'tasks',
        title: 'My Tasks',
        loadComponent: () =>
          import('./features/tasks/task-list/task-list.component').then((m) => m.TaskListComponent),
      },
      {
        path: 'tasks/manage',
        title: 'Create Task',
        loadComponent: () =>
          import('./features/tasks/task-form/task-form.component').then((m) => m.TaskFormComponent),
      },
      {
        path: 'tasks/manage/:id',
        title: 'Edit Task',
        loadComponent: () =>
          import('./features/tasks/task-form/task-form.component').then((m) => m.TaskFormComponent),
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  }
];
