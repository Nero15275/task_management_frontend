import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { StorageService } from '../../../core/services/storage.service';
import { Router } from '@angular/router';
import { filter, map, Subject, takeUntil } from 'rxjs';
import { User, UserRole } from '../../../core/models/user';
import { AuthService } from '../../auth/auth.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  currentUser: User;
  private destroy$ = new Subject<void>();
  userForm!: FormGroup;
  isEditMode: boolean = false;
  assignableUsers: User[];
  userObject: User;
  UserRole=UserRole
  roleDropdown =[UserRole.Employee,UserRole.TeamLead]


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private storageService:StorageService,
    private authService:AuthService,
    private router : Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getInitData();
    this.userForm.get('role').valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value)=>{
      if(value==UserRole.TeamLead){
        this.userForm.get("reportsTo").disable()
        this.userForm.get("reportsTo").setValue('')
         this.userForm.get("reportsTo").removeValidators(Validators.required)
      }else{
        this.userForm.get("reportsTo").enable()
        this.userForm.get("reportsTo").addValidators(Validators.required)
        this.setRollDropDown()
      }

    })
  }
    getInitData(){
      this.currentUser=this.storageService.getUser()
       this.userService.userSubject$
            .pipe(takeUntil(this.destroy$))
            .subscribe((user:User) => {
              this.userObject = user;
              if(user?._id){
                this.isEditMode=true
                this.userForm.removeControl('password')
                this.patchValue()
              }
            });

      this.userService
              .loadReportingUsers()
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (users) =>
                  console.log('Successfully loaded and flattened users:', users),
                error: (err) => console.error('Failed to load reporting users:', err),
              });

       this.userService.userList$
        .pipe(takeUntil(this.destroy$),
        map((users:User[])=>users.filter((user)=>user.role==UserRole.TeamLead&&(this.userObject?user._id!=this.userObject._id:true))))
        .subscribe((users) => {
          this.assignableUsers = users;

        });

        if(this.currentUser.role==UserRole.TeamLead){
          this.userForm.get("role").setValue(UserRole.Employee)
          this.userForm.get("role").disable()
          this.userForm.get("reportsTo").setValue(this.currentUser._id)
          this.userForm.get("reportsTo").disable()

        }
        this.setRollDropDown()
    }

    setRollDropDown(){
      if(this.currentUser.role===UserRole.SUPER_ADMIN){
        this.roleDropdown=[UserRole.Manager]
        this.userForm.get("reportsTo").disable()
      }
    }

  createForm() {
    this.userForm = this.fb.group({
      username: ['',[Validators.required,Validators.minLength(3),Validators.maxLength(30)]],
      email: [,[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(8),Validators.maxLength(30)]],
      role: ['',[Validators.required]],
      reportsTo:['']
    });
  }

   patchValue() {
    this.userForm.get('username').setValue(this.userObject.username)
    this.userForm.get('email').setValue(this.userObject.email)
    this.userForm.get('role').setValue(this.userObject.role)
    this.userForm.get('reportsTo').setValue(this.userObject.reportsTo)
     if(this.userObject.role==UserRole.TeamLead){
        this.userForm.get("reportsTo").disable()
        this.userForm.get("reportsTo").setValue('')
         this.userForm.get("reportsTo").removeValidators(Validators.required)
      }
  }



  onCancel() {
  this.userService.setUserForEdit({}as User)
  this.router.navigate(['users'])
  }

  onSubmit() {
    if (this.userForm.valid) {
      if(!this.userForm.get('reportsTo').value){
        this.userForm.get('reportsTo').enable()
        this.userForm.get('reportsTo').setValue(this.currentUser._id)
      }
      let payload= this.userForm.getRawValue()
      if(this.currentUser.role===UserRole.SUPER_ADMIN){
        const { reportsTo,...cleanPayload}=payload
        payload=cleanPayload
      }
      this.callService(payload)

    }
  }

  callService(payload){
     if(!this.isEditMode){
        this.authService.register(payload).subscribe({
          next:(res:any)=>{
           this.toastService.success(res.message,'');
          this.onCancel()
        },error:(err)=>{
          this.toastService.error('',err.message);
        }})
      }else{
        this.userService.updateUser(this.userObject._id,payload).subscribe({
          next:(res:any)=>{
            this.toastService.success(res.message,'');
          this.onCancel()
        },error:(err)=>{
          this.toastService.error('',err.message);
        }})
      }
  }

    ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
