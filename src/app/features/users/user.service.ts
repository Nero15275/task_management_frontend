import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { User } from '../../core/models/user';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly baseUrl = `${environment.apiUrl}v1/users`;


  private readonly userListSubject = new BehaviorSubject<User[]>([]);


  public readonly userList$: Observable<User[]> = this.userListSubject.asObservable();

  constructor(private http: HttpClient) {}


  public loadReportingUsers(): Observable<User[]> {
    const url = `${this.baseUrl}/reporting`;

    return this.http.get<any>(url).pipe(
      map(response => {
        console.log(response.data)

       const flattened = this.flattenUsers(response.data);
       return flattened;
      }),
      tap((flattenedUsers: User[]) => {
        this.userListSubject.next(flattenedUsers);
      })
    );
  }

    public getAllUsers(): Observable<{data:User[],success:boolean}> {
    const url = `${this.baseUrl}/`;

    return this.http.get<any>(url).pipe(tap((response)=>{
      this.userListSubject.next(response.data);
    }))

  }


  public get currentUserList(): User[] {
    return this.userListSubject.getValue();
  }


  public clearUserList(): void {
    this.userListSubject.next([]);
  }


  private flattenUsers(data: any[]): User[] {
  return data.flatMap(parent => {
    // 1. Destructure to separate teamMembers from the parent user data
    const { teamMembers, ...userOnly } = parent;

    // 2. Return an array containing the parent + the spread members
    // Use (teamMembers || []) to safely handle cases where teamMembers might be null/undefined
    return [userOnly, ...(teamMembers || [])];
  });
}
}
