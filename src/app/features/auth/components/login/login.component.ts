import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { AuthLogin } from '../../../../models/auth.model';
import { Store } from '@ngrx/store';
import { login } from '../../../../shared/stores/actions/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
      ),
    ]),
    password: new FormControl('', [
      Validators.minLength(8),
      Validators.required,
    ]),
  });
  hide = true;
  token = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<{ loggedIn: boolean }>
  ) {}

  getErrorMessage(fieldName: string) {
    const field = this.loginForm.get(fieldName);
    if (field?.touched && field?.hasError('required')) {
      return 'Ingresa un valor';
    }
    return field?.hasError('email') || field?.hasError('pattern')
      ? 'Ingresa un email válido'
      : field?.dirty && field?.hasError('minlength')
      ? 'La contraseña debe contener mínimo 8 caracteres'
      : '';
  }

  async login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      (
        await this.authService.login({ email, password } as AuthLogin)
      ).subscribe({
        next: (res) => {
          console.log(res);
          this.authService.setTokenId(res);
            this.store.dispatch(login());
        },
        error: (err) => console.error({ err }),
        complete: () => this.router.navigate(['/map']),
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  redirectSignUp() {
    this.router.navigate(['/auth/register']);
  }
}
