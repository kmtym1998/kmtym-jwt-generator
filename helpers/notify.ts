import { toast } from 'react-toastify';

export const notify = () =>
  toast.success('copied!!', {
    position: 'top-center',
    hideProgressBar: true,
    autoClose: 1000,
  });
