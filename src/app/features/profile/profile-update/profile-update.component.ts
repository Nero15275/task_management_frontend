import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StorageService } from '../../../core/services/storage.service';
import { UserService } from '../../users/user.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-profile-update',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './profile-update.component.html',
  styleUrl: './profile-update.component.scss'
})
export class ProfileUpdateComponent {
private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private storageService = inject(StorageService);

  profileForm!: FormGroup;
  currentUser: any;
  showPasswordFields = false;

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    // Fetch user data from local/session storage
    this.currentUser = this.storageService.getUser();
    this.initForm();
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      username: [
        this.currentUser?.username || '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(30)]
      ],
      email: [
        this.currentUser?.email || '',
        [Validators.required, Validators.email]
      ],
      // Initialize password as disabled so it's excluded from form.value by default
      password: [
        { value: '', disabled: true },
        [Validators.required, Validators.minLength(8), Validators.maxLength(128)]
      ]
    });
  }

  // Getters for easy template access
  get f() {
    return this.profileForm.controls;
  }

  onTogglePasswordChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.showPasswordFields = isChecked;
    const passwordControl = this.profileForm.get('password');

    if (isChecked) {
      passwordControl?.enable();
    } else {
      passwordControl?.disable();
      passwordControl?.reset(); // Clears any input if they uncheck it
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Angular naturally drops disabled fields from form.value
    const rawPayload = this.profileForm.value;

    // Apply identical transformations to match your Zod backend schema definitions
    const payload: any = {};
    if (rawPayload.username) payload.username = rawPayload.username.trim();
    if (rawPayload.email) payload.email = rawPayload.email.toLowerCase().trim();
    if (rawPayload.password) payload.password = rawPayload.password; // backend handles hashing

    // Fallback ID checking depending on your JWT user payload shape (_id or id)
    const userId = this.currentUser._id || this.currentUser.id;

    this.userService.updateUser(userId, payload).subscribe({
      next: (response) => {
        this.successMessage = 'Profile updated successfully!';

        // Update local storage with the new updates returned by the backend
        const updatedUser = { ...this.currentUser, ...response };
        this.storageService.saveUser(updatedUser);
        this.currentUser = updatedUser;

        // Reset password fields and toggle off password visibility after change
        this.showPasswordFields = false;
        this.profileForm.get('password')?.disable();
        this.profileForm.get('password')?.reset();

        this.isSubmitting = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Something went wrong while updating your profile.';
        this.isSubmitting = false;
      }
    });
  }
}
