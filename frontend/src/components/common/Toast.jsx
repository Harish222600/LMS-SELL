import { Toaster } from 'react-hot-toast';

const Toast = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={16}
      containerClassName=""
      containerStyle={{
        top: 100,
        zIndex: 9999,
      }}
      toastOptions={{
        className: '',
        duration: 4500,
        style: {
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          color: '#ffffff',
          border: '2px solid rgba(217, 119, 6, 0.3)',
          borderRadius: '1rem',
          padding: '18px 24px',
          boxShadow: '0 25px 50px -12px rgba(30, 58, 138, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          fontSize: '15px',
          fontWeight: '500',
          fontFamily: 'Inter, system-ui, sans-serif',
          maxWidth: '480px',
          minWidth: '320px',
          transform: 'translateZ(0)',
          animation: 'slideInDown 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        },

        success: {
          style: {
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.95) 0%, rgba(16, 185, 129, 0.95) 100%)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '2px solid rgba(34, 197, 94, 0.4)',
            boxShadow: '0 25px 50px -12px rgba(34, 197, 94, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: 'rgba(34, 197, 94, 0.95)',
          },
        },

        error: {
          style: {
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 0.95) 100%)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '2px solid rgba(239, 68, 68, 0.4)',
            boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: 'rgba(239, 68, 68, 0.95)',
          },
        },

        loading: {
          style: {
            background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.95) 0%, rgba(180, 83, 9, 0.95) 100%)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '2px solid rgba(217, 119, 6, 0.4)',
            boxShadow: '0 25px 50px -12px rgba(217, 119, 6, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: 'rgba(217, 119, 6, 0.95)',
          },
        },

        custom: {
          style: {
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(217, 119, 6, 0.95) 100%)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '2px solid rgba(217, 119, 6, 0.4)',
            boxShadow: '0 25px 50px -12px rgba(30, 58, 138, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
          },
        },
      }}
    />
  );
};

export default Toast;
