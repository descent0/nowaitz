import  { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, verifyOtp, signupUser, resetState } from '../../store/userSlice';
import useAuth from '../../utils/checkAuth';

const UserRegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  const dispatch = useDispatch();
  const { otpSent, emailVerified, authLoading, otpLoading, error, message } = useSelector((state) => state.authUser || {});
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    if (otpSent) {
      setShowOtpInput(true);
      setOtpTimer(60); // 60 seconds to enter OTP
    }
    if (emailVerified) {
      setShowOtpInput(false);
    }
  }, [otpSent, emailVerified]);

  useEffect(() => {
    if (otpTimer > 0) {
      const countdown = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [otpTimer]);

  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        dispatch(resetState());
      }, 4000);

      return () => clearTimeout(timer); 
    }
  }, [error, message]);

  const validateForm = () => {
    if (!formData.email || !formData.email.includes('@')) {
      alert('Please enter a valid email.');
      return false;
    }
    if (!formData.password || formData.password.length < 6) { 
      alert('Password must be at least 6 characters long.');
      return false;
    }
    if (!formData.name || formData.name.length < 3) {
      alert('Name must be at least 3 characters long.');
      return false;
    }
    if (!formData.phone || formData.phone.length < 10) {
      alert('Phone number must be at least 10 digits long.');
      return false;
    }
    if (!formData.address || formData.address.length < 5) {
      alert('Address must be at least 5 characters long.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return false;
    }
    return true;
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch(sendOtp(formData.email));
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      alert('Please enter the OTP.');
      return;
    }

    // First verify OTP
    const verifyAction = await dispatch(verifyOtp({ email: formData.email, otp: formData.otp }));
    
    // If OTP verification was successful, register the user
    if (verifyOtp.fulfilled.match(verifyAction)) {
      const signupAction = await dispatch(signupUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password
      }));
      
      if (signupUser.fulfilled.match(signupAction)) {
        navigate('/', { replace: true });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showOtpInput) {
      handleVerifyAndRegister(e);
    } else {
      handleSendOtp(e);
    }
  };

  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center px-4 py-8">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="flex flex-col items-center mb-6">
          <img src="logo.png" alt="Logo" className="w-16 h-16 mb-2" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Create an Account</h1>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        {message && <div className="bg-green-100 text-green-700 p-2 rounded mb-4">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="text-sm">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  disabled={otpSent}
                  className="w-full p-2 border rounded" 
                />
              </div>

              <div>
                <label className="text-sm">
                  Email {emailVerified && <span className="text-green-500 text-xs ml-2">(Verified)</span>}
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  disabled={otpSent} 
                  className="w-full p-2 border rounded" 
                />
              </div>

              {showOtpInput && (
                <div className="bg-gray-100 p-4 rounded border space-y-2">
                  <label className="text-sm">Enter OTP</label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="123456"
                  />
                  {otpTimer > 0 ? (
                    <p className="text-xs text-gray-600">OTP expires in {otpTimer}s</p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpLoading}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              )}

              <div>
                <label className="text-sm">Phone</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone} 
                  onChange={handleChange} 
                  required 
                  disabled={otpSent}
                  className="w-full p-2 border rounded" 
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="text-sm">Address</label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address} 
                  onChange={handleChange} 
                  required 
                  disabled={otpSent}
                  className="w-full p-2 border rounded" 
                />
              </div>
              <div>
                <label className="text-sm">Password</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                  disabled={otpSent}
                  className="w-full p-2 border rounded" 
                />
              </div>
              <div>
                <label className="text-sm">Confirm Password</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  required 
                  disabled={otpSent}
                  className="w-full p-2 border rounded" 
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={authLoading || otpLoading}
            className="w-full py-2 text-white rounded bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {authLoading 
              ? 'Registering...' 
              : otpLoading 
                ? 'Verifying...' 
                : showOtpInput 
                  ? 'Verify and Register' 
                  : 'Send OTP'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserRegistrationPage;