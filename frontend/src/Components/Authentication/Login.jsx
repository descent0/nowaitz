import axios from 'axios';
import  { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, loginUser } from './../../store/userSlice';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopID, setShopID] = useState('');
  const [userType, setUserType] = useState('user');
  const [errorMessage, setErrorMessage] = useState('');
  const [localErrorVisible, setLocalErrorVisible] = useState(false);
  const [reduxErrorVisible, setReduxErrorVisible] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, error, message } = useSelector((state) => state.authUser);

  useEffect(() => {
    let timer;
    if (errorMessage) {
      setLocalErrorVisible(true);
      timer = setTimeout(() => setLocalErrorVisible(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    let errorTimer, messageTimer;
    if (error) {
      setReduxErrorVisible(true);
      errorTimer = setTimeout(() => setReduxErrorVisible(false), 5000);
    }
    if (message) {
      setMessageVisible(true);
      messageTimer = setTimeout(() => setMessageVisible(false), 5000);
    }
    return () => {
      clearTimeout(errorTimer);
      clearTimeout(messageTimer);
    };
  }, [error, message]);

  const handleUserLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const userData = { email, password };
    dispatch(loginUser(userData));
  };

  const handleServiceManLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const shopData = { shopID, password };
      await axios.post(`${process.env.REACT_APP_BACKEND_API}/api/shop/login`, shopData, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });
      navigate('/shopDashBoard', { replace: true });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
      setShopID('');
      setPassword('');
    }
  };

  const handleGoogleLogin = () => {
    const width = 500, height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const googleWindow = window.open(
        `${process.env.REACT_APP_BACKEND_API}/api/auth/google`,
        'Google Login',
        `width=${width},height=${height},top=${top},left=${left}`
    );

    const pollTimer = setInterval(() => {
        if (googleWindow.closed) {
            clearInterval(pollTimer);
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        }
    }, 500);
  };

  const handleForgotPassword = () => {
    if (!email) {
      alert('Please enter your email to reset your password.');
      return;
    }
    dispatch(forgotPassword(email));
    alert(
      'A reset link has been sent to your email if it exists in our records.'
    );
  };

  useEffect(() => {
    if (user?.role === 'admin') navigate('/adminDashBoard', { replace: true });
    else if (user?.role === 'moderator') navigate('/moderatorDashBoard', { replace: true });
    else if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center px-4">
      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center mb-6">
          <img src={"logo.png"} alt="Logo" className="w-16 h-16 mb-2" />
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
        </div>

        <div className="flex justify-center mb-6">
          <motion.h1
            className={`text-lg font-bold px-4 py-2 rounded-md cursor-pointer ${
              userType === 'serviceman' ? 'bg-blue-600 text-white' : 'text-gray-700'
            }`}
            onClick={() => setUserType('serviceman')}
            whileHover={{ scale: 1.1 }}
          >
            Shop Owner
          </motion.h1>
          <motion.h1
            className={`text-lg font-bold px-4 py-2 rounded-md cursor-pointer ${
              userType === 'user' ? 'bg-blue-600 text-white' : 'text-gray-700'
            }`}
            onClick={() => setUserType('user')}
            whileHover={{ scale: 1.1 }}
          >
            User
          </motion.h1>
        </div>

        <form
          onSubmit={userType === 'user' ? handleUserLogin : handleServiceManLogin}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor={userType === 'user' ? 'email' : 'shopID'}
              className="block text-sm font-medium text-gray-600"
            >
              {userType === 'user' ? 'Email' : 'Shop ID'}
            </label>
            <input
              type={userType === 'user' ? 'email' : 'text'}
              id={userType === 'user' ? 'email' : 'shopID'}
              value={userType === 'user' ? email : shopID}
              onChange={(e) =>
                userType === 'user'
                  ? setEmail(e.target.value)
                  : setShopID(e.target.value)
              }
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder={userType === 'user' ? 'you@example.com' : 'Shop ID'}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="••••••••"
            />
          </div>

          {localErrorVisible && errorMessage && (
            <div className="text-red-500 text-sm">{errorMessage}</div>
          )}

          {reduxErrorVisible && error && (
            <div className="text-red-600 text-sm text-center mt-2">❌ {error}</div>
          )}

          {messageVisible && message && !error && (
            <div className="text-green-600 text-sm text-center mt-2">✅ {message}</div>
          )}

          <motion.button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            whileHover={{ scale: 1.05 }}
          >
            Sign In
          </motion.button>
        </form>

        {userType === 'user' && (
          <>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
            <Link to="/userRegister" className="block text-center text-sm text-gray-600 underline mt-4">
              Not Registered? Create Account
            </Link>
            <div className="flex items-center justify-center mt-4">
              <span className="text-sm text-gray-600">or</span>
            </div>
            <motion.button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md p-2 mt-4 hover:bg-gray-100"
              whileHover={{ scale: 1.05 }}
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Continue with Google
            </motion.button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default LoginPage;
