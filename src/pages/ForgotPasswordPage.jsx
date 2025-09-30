import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authAPI } from '../services';
import Input from '../components/Input';
import Button from '../components/Button';

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetInfo, setResetInfo] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await authAPI.forgotPassword(data.email);
      
      setResetSent(true);
      setResetInfo(response);
      toast.success('Reset instructions sent! Check console for demo link.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset instructions');
    } finally {
      setLoading(false);
    }
  };

  if (resetSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Check Your Email
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We have  sent password reset instructions to your email address.
            </p>
            
            {/* Demo Information */}
            {resetInfo && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">
                  Demo Mode - Password Reset Info
                </h3>
                <p className="text-xs text-yellow-700 mb-2">
                  In production, this would be sent via email. For demo purposes:
                </p>
                <div className="text-xs text-left space-y-1">
                  <p><strong>Reset Token:</strong> {resetInfo.resetToken}</p>
                  <Link 
                    to={`/reset-password/${resetInfo.resetToken}`}
                    className="inline-block mt-2 bg-yellow-600 text-white px-3 py-1 rounded text-xs hover:bg-yellow-700"
                  >
                    Go to Reset Password Page
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-500">
              Did not receive the email? Check your spam folder or try again.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setResetSent(false);
                  setResetInfo(null);
                }}
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                Try a different email address
              </button>
            </div>
            <Link
              to="/login"
              className="block text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              Back to Login
            </Link>
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
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we will send you instructions to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              label="Email Address"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Please enter a valid email',
                },
              })}
              error={errors.email?.message}
              placeholder="Enter your email address"
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
              Send Reset Instructions
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
      </div>
    </div>
  );
};

export default ForgotPasswordPage;