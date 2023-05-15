import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static passwordsMatching(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const passwordConfirm = control.get('passwordConfirm')?.value;

    if (
      password === passwordConfirm &&
      password !== null &&
      passwordConfirm !== null
    ) {
      return null;
    } else {
      return { passwordsNotMatching: true };
    }
  }

  static checkPassword(control: AbstractControl): ValidationErrors | null {
      const enteredPassword = control.value;
      const passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.{6,})/;

      return !passwordCheck.test(enteredPassword) && enteredPassword
        ? { requirements: true }
        : null;
  }
}
