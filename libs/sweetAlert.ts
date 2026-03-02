import Swal from 'sweetalert2';

const popupBase = {
	background: '#FFFFFF',
	color: '#111111',
	confirmButtonColor: '#111111',
	customClass: {
		popup: 'timeless-swal-popup',
		confirmButton: 'timeless-swal-confirm',
		cancelButton: 'timeless-swal-cancel',
	},
} as const;

export const sweetErrorAlert = async (message: string) => {
	await Swal.fire({
		...popupBase,
		icon: 'error',
		title: 'Something went wrong',
		text: message,
		confirmButtonText: 'OK',
		showCloseButton: true,
	});
};

export const sweetMixinErrorAlert = async (message: string) => {
	await Swal.fire({
		...popupBase,
		icon: 'error',
		title: message,
		showConfirmButton: false,
		timer: 1500,
		toast: true,
		position: 'top-end',
		background: '#111111',
		color: '#FAFAFA',
	});
};

export const sweetMixinSuccessAlert = async (message: string) => {
	await Swal.fire({
		...popupBase,
		icon: 'success',
		title: message,
		showConfirmButton: false,
		timer: 1500,
		toast: true,
		position: 'top-end',
		background: '#111111',
		color: '#FAFAFA',
	});
};

export const sweetConfirmAlert = async (message: string): Promise<boolean> => {
	const result = await Swal.fire({
		...popupBase,
		title: 'Please Confirm',
		text: message,
		icon: 'question',
		showCancelButton: true,
		confirmButtonText: 'Yes',
		cancelButtonText: 'No',
		reverseButtons: true,
		showCloseButton: true,
	});
	return result.isConfirmed;
};

export const sweetInfoAlert = async (message: string) => {
	await Swal.fire({
		...popupBase,
		title: message,
		icon: 'info',
		confirmButtonText: 'OK',
		showCloseButton: true,
	});
};
