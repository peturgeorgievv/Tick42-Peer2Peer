import { UsersService } from './users.service';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

describe('UsersService', () => {
	const userService = {
		getAllUsers() {
			return of();
		},
		getUserDoc() {
			return of();
		},
		getUserPayments() {
			return of();
		}
	};

	let service: UsersService;

	beforeEach(() => {
		jest.clearAllMocks();

		TestBed.configureTestingModule({
			imports: [],
			providers: [ UsersService ]
		}).overrideProvider(UsersService, { useValue: userService });

		service = TestBed.get(UsersService);
	});

	it('getAllUsers should be called once and return observebale', () => {
		// Arrange
		const spyAllUsers = jest.spyOn(userService, 'getAllUsers').mockImplementation(() => {
			return of();
		});

		// Act
		service.getAllUsers();

		// Assert
		expect(spyAllUsers).toHaveBeenCalledTimes(1);
		expect(spyAllUsers).toReturnWith(of());
	});

	it('getUserDoc should be called once and return observebale', () => {
		// Arrange
		const userDocId = '1';
		const spyOneUser = jest.spyOn(userService, 'getUserDoc').mockImplementation(() => {
			return of();
		});

		// Act
		service.getUserDoc(userDocId);

		// Assert
		expect(spyOneUser).toHaveBeenCalledTimes(1);
		expect(spyOneUser).toReturnWith(of());
	});

	it('getUserPayments should be called once and return observebale', () => {
		// Arrange
		const userId = '1';
		const spyUserPayments = jest.spyOn(userService, 'getUserPayments').mockImplementation(() => {
			return of();
		});

		// Act
		service.getUserPayments(userId);

		// Assert
		expect(spyUserPayments).toHaveBeenCalledTimes(1);
		expect(spyUserPayments).toReturnWith(of());
	});
});
