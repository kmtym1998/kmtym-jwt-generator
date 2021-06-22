import { toast } from 'react-toastify';

export const notify = () =>
  toast.success('JWT Copied!', {
    position: 'top-center',
    hideProgressBar: true,
    autoClose: 1000,
  });
