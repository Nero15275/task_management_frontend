import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '../../core/models/user';
import { APP_CONFIG } from 'src/app/core/config/app.config.token';



@Injectable({
  providedIn: 'root'
})
export class UserService {
    private config = inject(APP_CONFIG);

  private readonly baseUrl = `${this.config.apiUrl}v1/users`;


  private readonly userListSubject = new BehaviorSubject<User[]>([]);


  public readonly userList$: Observable<User[]> = this.userListSubject.asObservable();

  private readonly userSubject = new BehaviorSubject<User>({}as User);


  public readonly userSubject$: Observable<User> = this.userSubject.asObservable();


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

    return this.http.get<{data:User[],success:boolean}>(url).pipe(tap((response)=>{
      this.userListSubject.next(response.data);
    }))

  }
      public getManagers(): Observable<{data:User[],success:boolean}> {
    const url = `${this.baseUrl}/managers`;

    return this.http.get<{data:User[],success:boolean}>(url).pipe(tap((response)=>{
      this.userListSubject.next(response.data);
    }))

  }

   getUserById(id:string){
    const url = `${this.baseUrl}/`;
    return this.http.get<{data:User,success:boolean}>(url)
  }
  deleteUser(id:string){
     const url = `${this.baseUrl}/${id}`;
    return this.http.delete(url)
  }
   updateUser(id:string,payload:Partial<User>){
     const url = `${this.baseUrl}/${id}`;
    return this.http.patch(url,payload)
  }

//helper functions

  public get currentUserList(): User[] {

    return this.userListSubject.getValue();
  }


  public clearUserList(): void {
    this.userListSubject.next([]);
  }

  public get currentUserForEdit(): User {

    return this.userSubject.getValue();
  }


  public setUserForEdit(user:User|null): void {
    this.userSubject.next(user);
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
