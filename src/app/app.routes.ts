import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';

export const routes: Routes = [// Auth pages (no layout)
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },

  // Pages with layout
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: DashboardComponent,
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/user-list/user-list.component').then(
            (m) => m.UserListComponent
          ),
      },
      {
        path: 'createEditusers',
        loadComponent: () =>
          import('./features/users/user-form/user-form.component').then(
            (m) => m.UserFormComponent
          ),
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./features/tasks/task-list/task-list.component').then(
            (m) => m.TaskListComponent
          ),
      },
       {
        path: 'createEdittasks',
        loadComponent: () =>
          import('./features/tasks/task-form/task-form.component').then(
            (m) => m.TaskFormComponent
          ),
      },
    ],
  },

//   {
//     path: '**',
//     redirectTo: '',
//   }
];
