import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { SignInDTO } from 'src/app/common/models/users/sign-in.dto';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  public signinForm: FormGroup;
  public data: SignInDTO;

  constructor(
    public authenticationService: AuthenticationService,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  signIn() {
    this.data = this.signinForm.value;
    this.authenticationService.signIn(this.data.email, this.data.password);
  }
}
