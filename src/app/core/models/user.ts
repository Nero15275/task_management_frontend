export interface User {
  _id: string;
  username: string;
  email: string;
  role:UserRole;
  isActive: boolean;
  reportsTo: string | null; // Can be null or an ID string if they report to a manager/lead
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AuthData {
  user: User;
  accessToken: string;
}

export interface LoginResponse {
  message: string;
  data: AuthData;
}
export  enum UserRole {
  Manager = 'manager',
  TeamLead = 'team_lead',
  Employee = 'employee'
}