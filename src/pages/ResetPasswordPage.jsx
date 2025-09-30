import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authAPI } from '../services';
import Input from '../components/Input';
import Button from '../components/Button';

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(true);
  const { resettoken } = useParams();
  const navigate = useNavigate();
  

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const watchPassword = watch('password');

  useEffect(() => {
    // Validate that we have a reset token
    if (!resettoken) {
      setValidToken(false);
    }
  }, [resettoken]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await authAPI.resetPassword(resettoken, data.password);
      
      // Store the new token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      toast.success('Password reset successful! You are now logged in.');
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      
      if (errorMessage.includes('Invalid or expired')) {
        setValidToken(false);
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Invalid Reset Link
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              This password reset link is invalid or has expired.
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-500">
              Password reset links expire after 10 minutes for security reasons.
            </p>
            <div className="space-y-2">
              <Link
                to="/forgot-password"
                className="block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Request New Reset Link
              </Link>
              <Link
                to="/login"
                className="block text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              label="New Password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              error={errors.password?.message}
              placeholder="Enter your new password"
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === watchPassword || 'Passwords do not match',
              })}
              error={errors.confirmPassword?.message}
              placeholder="Confirm your new password"
              required
            />
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              Reset Password
            </Button>
            
            <div className="text-center">
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Password Requirements
          </h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• At least 6 characters long</li>
            <li>• Choose a strong, unique password</li>
            <li>• Consider using a password manager</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;