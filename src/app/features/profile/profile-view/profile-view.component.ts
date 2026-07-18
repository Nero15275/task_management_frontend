import { UserService } from './../../users/user.service';
import { Component } from '@angular/core';
import { StorageService } from '../../../core/services/storage.service';
import { User, UserRole } from '../../../core/models/user';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [DatePipe,CommonModule],
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.scss'
})
export class ProfileViewComponent {
  currrentUser!: User;
  reportingManager?:User
  userRole =UserRole

  constructor(private storageService:StorageService,private userService:UserService,private router:Router){}

  ngOnInit(){
    this.getInitData()
  }

  getInitData(){
    this.currrentUser = this.storageService.getUser();
     if(this.currrentUser.reportsTo){
      this.userService.getUserById(this.currrentUser.reportsTo).subscribe({
        next:(response)=>{
          this.reportingManager=response.data
        },
        error:(err)=>{
          console.log(err)
        }
      })
     }
  }
onEditProfile() {
 this.userService.setUserForEdit(this.currrentUser)
  this.router.navigate(['users/manage'])

}


}
