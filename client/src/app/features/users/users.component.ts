import { ShowDetailsModalComponent } from './show-details-modal/show-details-modal.component';
import { RegisterUserDTO } from './../../common/models/users/register-user.dto';
import { CreateAdminModalComponent } from './create-admin-modal/create-admin-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from './../../core/services/authentication.service';
import { UsersService } from './../../core/services/users.service';
import { UserDTO } from './../../common/models/users/user-data.dto';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public users: UserDTO[];

  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthenticationService,
    private readonly modalService: NgbModal
  ) {}

  public ngOnInit(): void {
    this.usersService.getAllUsers().subscribe((userData: UserDTO[]) => {
      this.users = userData;
    });
  }

  public openCreateAdminModal(): void {
    const createAdminModal = this.modalService.open(CreateAdminModalComponent);
    createAdminModal.componentInstance.createAdmin.subscribe(
      (data: RegisterUserDTO) => {
        this.authService.signUp(
          data.email,
          data.password,
          data.firstName,
          data.lastName,
          'admin'
        );
      }
    );
  }

  public openShowDetailsModal(userId: string): void {
    const showDetailsModal = this.modalService.open(ShowDetailsModalComponent);
    showDetailsModal.componentInstance.userId = userId;
  }
}
