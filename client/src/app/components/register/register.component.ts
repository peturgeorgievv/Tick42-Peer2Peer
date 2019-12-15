import { AuthenticationService } from './../../core/services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerUserForm: FormGroup;

  public status = 'basic';

  constructor(
    public authenticationService: AuthenticationService,
    public formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.registerUserForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  signUp() {
    const data = this.registerUserForm.value;
    this.authenticationService.signUp(data.email, data.password, data.firstName, data.lastName, this.status);
  }
}








