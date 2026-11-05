import { toast } from 'react-toastify';

export const notify = (message, type = 'default') => {
     if (toast[type]) {
          toast[type](message);
     } else {
          toast(message);
     }
};

// Valid types:

// 'success' ✅ (green)
// 'error' ❌ (red)
// 'warning' ⚠️ (yellow)
// 'info' ℹ️ (blue)
// 'default' (normal)