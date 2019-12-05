import { BorrowerService } from './../../core/services/borrower.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificatorService } from './../../core/services/notificator.service';
import { AuthenticationService } from './../../core/services/authentication.service';
import { BorrowerComponent } from './borrower.component';
import { of } from 'rxjs';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';

describe('BorrowerComponent', () => {
  let authService;
  let notificatorService;
  let modalService;
  let borrowerService;

  let fixture: ComponentFixture<BorrowerComponent>;
  let component: BorrowerComponent;

  beforeEach(async(() => {
    jest.clearAllMocks();

    authService = {
      get loggedUser$() {
        return of();
      }
    };

    modalService = {
        open() {},
    };

    notificatorService = {
      success() {},
      error() {},
    };

    borrowerService = {
      getUserLoans() {},
      getUserSuggestions() {},
      getAllPayments() {},
      createLoanRequest() {},
      addRequestIdToLoan() {},
      getUserRequestsAsc() {},
      getUserRequestsDesc() {},
    };

    TestBed.configureTestingModule({
      imports: [],
      declarations: [BorrowerComponent],
      providers: [AuthenticationService, BorrowerService, NotificatorService, NgbModal]
    })
      .overrideProvider(AuthenticationService, { useValue: authService })
      .overrideProvider(NotificatorService, { useValue: notificatorService })
      .overrideProvider(NgbModal, { useValue: modalService })
      .overrideProvider(BorrowerService, { useValue: borrowerService })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(BorrowerComponent);
        component = fixture.componentInstance;
      });
  }));

  it('should be defined', () => {
    // Arrange & Act & Assert
    expect(component).toBeDefined();
  });

//   describe('ngOnInit()', () => {
//     it('should subscribe to the authService.loggedUserData$ once', () => {
//       // Arrange
//       const mockedUser = 'mocked user';
//       const spy = jest
//         .spyOn(authService, 'loggedUserData$', 'get')
//         .mockReturnValue(of(mockedUser));

//       // Act
//       component.ngOnInit();

//       // Assert
//       expect(spy).toBeCalledTimes(1);
//     });

//     it('should set the loggedUserData field with the passed value', () => {
//       // Arrange
//       const mockedUser = 'mocked user';
//       const spy = jest
//         .spyOn(authService, 'loggedUserData$', 'get')
//         .mockReturnValue(of(mockedUser));

//       // Act
//       component.ngOnInit();

//       // Assert
//       expect(component.loggedUserData).toEqual(mockedUser);
//     });

//     it('should set the loggedUserData field with the passed value', () => {
//       // Arrange
//       const mockedUser = 'mocked user';
//       const spy = jest
//         .spyOn(authService, 'loggedUserData$', 'get')
//         .mockReturnValue(of(mockedUser));

//       // Act
//       component.ngOnInit();

//       // Assert
//       expect((component as any).loggedUserSubscription).toBeDefined();
//     });
//   });

//   describe('onFileSelected()', () => {
//     it('should call the usersService.uploadAvatar() once with correct parameters', () => {
//       // Arrange
//       const mockLoggedUserData = { id: 1 };
//       (component as any).loggedUserData = mockLoggedUserData;

//       const mockedUser = 'mocked user';
//       const uploadUserAvatarSpy = jest
//         .spyOn(usersService, 'uploadUserAvatar')
//         .mockReturnValue(of(mockedUser));

//       const emitUserDataSpy = jest.spyOn(authService, 'emitUserData');

//       const mockedFile = 'mocked file';
//       // Act
//       component.onFileSelected(mockedFile as any);

//       // Assert
//       expect(uploadUserAvatarSpy).toHaveBeenCalledWith(
//         mockLoggedUserData.id,
//         mockedFile
//       );
//       expect(uploadUserAvatarSpy).toHaveBeenCalledTimes(1);
//     });

//     it('should call authService.emitUserData() once with the passed user data from the successful observable', () => {
//       // Arrange
//       const mockLoggedUserData = { id: 1 };
//       (component as any).loggedUserData = mockLoggedUserData;

//       const mockedUser = 'mocked user';
//       const uploadUserAvatarSpy = jest
//         .spyOn(usersService, 'uploadUserAvatar')
//         .mockReturnValue(of(mockedUser));

//       const emitUserDataSpy = jest.spyOn(authService, 'emitUserData');

//       const mockedFile = 'mocked file';
//       // Act
//       component.onFileSelected(mockedFile as any);

//       // Assert
//       expect(emitUserDataSpy).toHaveBeenCalledWith(mockedUser);
//       expect(emitUserDataSpy).toHaveBeenCalledTimes(1);
//     });
//   });
});
