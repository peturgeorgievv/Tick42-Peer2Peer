import { UsersService } from './users.service';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

describe('UsersService', () => {
  const userService = {
    getAllUsers() {
      return of();
    },
    getUserLoans() {
      return of();
    }
  };

  let service: UsersService;

  beforeEach(() => {
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      imports: [],
      providers: [UsersService]
    }).overrideProvider(UsersService, { useValue: userService });

    service = TestBed.get(UsersService);
  });

  it('getAllUsers should be called once and return observebale', () => {
    // Arrange
    const spyAllUsers = jest
      .spyOn(userService, 'getAllUsers')
      .mockImplementation(() => {
        return of();
      });

    // Act
    service.getAllUsers();

    // Assert
    expect(spyAllUsers).toHaveBeenCalledTimes(1);
    expect(spyAllUsers).toReturnWith(of());
  });

  it('getUserLoans should be called once and return observebale', () => {
    // Arrange
    const userId = '1';
    const spyUserLoans = jest
      .spyOn(userService, 'getUserLoans')
      .mockImplementation(() => {
        return of();
      });

    // Act
    service.getUserLoans(userId);

    // Assert
    expect(spyUserLoans).toHaveBeenCalledTimes(1);
    expect(spyUserLoans).toReturnWith(of());
  });
});
