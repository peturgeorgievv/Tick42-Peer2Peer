import { UsersService } from './../../core/services/users.service';
import { UserDTO } from './../../common/models/users/user-data.dto';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: [ './users.component.css' ]
})
export class UsersComponent implements OnInit {
	public users: UserDTO[];

	constructor(private readonly usersService: UsersService) {}

	ngOnInit() {
		this.usersService.getAllUsers().subscribe((userData: UserDTO[]) => {
			this.users = userData;
			console.log(userData);
		});
	}
}
