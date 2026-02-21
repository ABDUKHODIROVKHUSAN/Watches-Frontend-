import Swal from 'sweetalert2';

export const sweetErrorAlert = async (message: string) => {
	await Swal.fire({
		icon: 'error',
		text: message,
		showConfirmButton: false,
		timer: 2000,
	});
};

export const sweetMixinErrorAlert = async (message: string) => {
	await Swal.fire({
		icon: 'error',
		title: message,
		showConfirmButton: false,
		timer: 1500,
		toast: true,
		position: 'top-end',
	});
};

export const sweetMixinSuccessAlert = async (message: string) => {
	await Swal.fire({
		icon: 'success',
		title: message,
		showConfirmButton: false,
		timer: 1500,
		toast: true,
		position: 'top-end',
	});
};

export const sweetConfirmAlert = async (message: string): Promise<boolean> => {
	const result = await Swal.fire({
		title: message,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes',
	});
	return result.isConfirmed;
};
