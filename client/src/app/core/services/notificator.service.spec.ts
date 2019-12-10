import { TestBed } from '@angular/core/testing';

import { NotificatorService } from './notificator.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('NotificatorService', () => {
	const toastr = {
		success() {},
		warning() {},
		error() {}
	};

	let service: NotificatorService;

	beforeEach(() => {
		jest.clearAllMocks();

		TestBed.configureTestingModule({
			imports: [ ToastrModule ],
			providers: [ NotificatorService ]
		}).overrideProvider(ToastrService, { useValue: toastr });

		service = TestBed.get(NotificatorService);
	});

	it('success should call success', () => {
		// Arrange
		jest.spyOn(toastr, 'success').mockImplementation(() => {});

		// Act
		service.success('Success');

		// Assert
		expect(toastr.success).toHaveBeenCalledWith('Success');
	});

	it('warn should call warn', () => {
		// Arrange
		jest.spyOn(toastr, 'warning').mockImplementation(() => {});

		// Act
		service.warn('Warning');

		// Assert
		expect(toastr.warning).toHaveBeenCalledWith('Warning');
	});

	it('error should call error', () => {
		// Arrange
		jest.spyOn(toastr, 'error').mockImplementation(() => {});

		// Act
		service.error('Error');

		// Assert
		expect(toastr.error).toHaveBeenCalledWith('Error');
	});
});
