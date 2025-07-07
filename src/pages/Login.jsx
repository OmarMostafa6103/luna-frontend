//? ========= START API ===========
//? ========= START API ===========

import React, { useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { backendUrl } from '../App';

const Login = () => {
  const { navigate, login } = useContext(ShopContext);

  const [currentState, setCurrentState] = useState("تسجيل الدخول");
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [phone, setPhone] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState('email');
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');

  // التحقق من صحة كلمة المرور
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // تبديل حالة النموذج بين تسجيل الدخول وإنشاء حساب
  const handleStateToggle = (newState) => {
    setCurrentState(newState);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setPasswordConfirmation('');
    setPhone('');
  };

  // إرسال نموذج تسجيل الدخول أو إنشاء حساب
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (currentState === 'إنشاء حساب') {
      if (!firstName || !lastName || !email || !password || !passwordConfirmation || !phone) {
        toast.error('يرجى ملء جميع الحقول');
        return;
      }

      if (!validatePassword(password)) {
        toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        return;
      }

      if (password !== passwordConfirmation) {
        toast.error('كلمات المرور غير متطابقة');
        return;
      }

      try {
        const response = await axios.post(`${backendUrl}/api/register`, {
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          password_confirmation: passwordConfirmation,
          phone,
        });

        if (response.data.message?.includes('Register Successfully')) {
          toast.success('تم التسجيل بنجاح! يرجى التحقق من بريدك الإلكتروني وتسجيل الدخول.', {
            style: { background: 'green', color: 'white' },
          });
          handleStateToggle('تسجيل الدخول');
        } else {
          toast.error(response.data.message || 'فشل التسجيل');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'فشل التسجيل');
      }
    } else if (currentState === 'تسجيل الدخول') {
      try {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        const response = await axios.post(`${backendUrl}/api/login`, formData);

        if (response.data.data?.token || response.data.message === 'login success') {
          const token = response.data.data?.token;
          const user = {
            firstName: response.data.data?.first_name,
            lastName: response.data.data?.last_name,
            email: email,
            redirect: response.data.data?.redirect || 'dashboard/user',
          };
          login(user, token);
          localStorage.setItem('token', token);
          toast.success('تم تسجيل الدخول بنجاح!', {
            style: { background: 'green', color: 'white' },
          });

          setTimeout(() => {
            if (user.redirect === 'dashboard/admin') {
              navigate('/add');
            } else {
              navigate('/');
            }
          }, 500);
        } else {
          toast.error(response.data.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'فشل تسجيل الدخول');
      }
    }
  };

  // تسجيل الدخول باستخدام جوجل
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const accessToken = credentialResponse.credential;
    try {
      const response = await axios.get(
        `${backendUrl}/api/login/google/callback?access_token=${accessToken}`
      );

      if (response.data.data?.token || response.data.message === 'login success') {
        const token = response.data.data?.token;
        const user = {
          firstName: response.data.data?.first_name,
          lastName: response.data.data?.last_name,
          email: response.data.data?.email || email,
          redirect: response.data.data?.redirect || 'dashboard/user',
        };
        login(user, token);
        localStorage.setItem('token', token);
        toast.success('تم تسجيل الدخول بجوجل بنجاح!', {
          style: { background: 'green', color: 'white' },
        });

        setTimeout(() => {
          if (user.redirect === 'dashboard/admin') {
            navigate('/add');
          } else {
            navigate('/');
          }
        }, 500);
      } else {
        toast.error(response.data.message || 'فشل تسجيل الدخول بجوجل');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل تسجيل الدخول بجوجل');
    }
  };

  // معالجة فشل تسجيل الدخول بجوجل
  const handleGoogleLoginFailure = () => {
    toast.error('فشل تسجيل الدخول بجوجل');
  };

  // إرسال رمز إعادة تعيين كلمة المرور
  const handleForgotPasswordEmail = async () => {
    if (!forgotPasswordEmail) {
      toast.error('يرجى إدخال بريدك الإلكتروني');
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/forget-password`, {
        email: forgotPasswordEmail,
      });

      if (response.data.status === 200 && response.data.message === 'Reset code sent successfully') {
        toast.success('تم إرسال رمز إعادة التعيين إلى بريدك الإلكتروني!', {
          style: { background: 'green', color: 'white' },
        });
        setForgotPasswordStep('code');
      } else {
        toast.error(response.data.message || 'فشل إرسال رمز إعادة التعيين');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل إرسال رمز إعادة التعيين');
    }
  };

  // التحقق من رمز إعادة التعيين
  const handleVerifyResetCode = async () => {
    if (!resetCode) {
      toast.error('يرجى إدخال رمز إعادة التعيين');
      return;
    }

    setForgotPasswordStep('newPassword');
  };

  // إعادة تعيين كلمة المرور
  const handleResetPassword = async () => {
    if (!newPassword || !newPasswordConfirmation) {
      toast.error('يرجى إدخال كلمة المرور الجديدة وتأكيدها');
      return;
    }

    if (!validatePassword(newPassword)) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    if (newPassword !== newPasswordConfirmation) {
      toast.error('كلمات المرور غير متطابقة');
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/reset-password`, {
        email: forgotPasswordEmail,
        reset_code: resetCode,
        password: newPassword,
        password_confirmation: newPasswordConfirmation,
      });

      if (response.data.message?.includes('Password reset successfully')) {
        toast.success('تم إعادة تعيين كلمة المرور بنجاح! جاري تسجيل الدخول...', {
          style: { background: 'green', color: 'white' },
        });

        try {
          const loginResponse = await axios.post(`${backendUrl}/api/login`, {
            email: forgotPasswordEmail,
            password: newPassword,
          });

          if (loginResponse.data.data?.token || loginResponse.data.message === 'login success') {
            const token = loginResponse.data.data?.token;
            const user = {
              firstName: loginResponse.data.data?.first_name,
              lastName: loginResponse.data.data?.last_name,
              email: forgotPasswordEmail,
              redirect: loginResponse.data.data?.redirect || 'dashboard/user',
            };
            login(user, token);
            localStorage.setItem('token', token);
            toast.success('تم تسجيل الدخول بنجاح!', {
              style: { background: 'green', color: 'white' },
            });

            setShowForgotPassword(false);
            setForgotPasswordEmail('');
            setResetCode('');
            setNewPassword('');
            setNewPasswordConfirmation('');
            setForgotPasswordStep('email');

            setTimeout(() => {
              if (user.redirect === 'dashboard/admin') {
                navigate('/add');
              } else {
                navigate('/');
              }
            }, 500);
          } else {
            toast.error(loginResponse.data.message || 'فشل تسجيل الدخول التلقائي');
            setShowForgotPassword(false);
            setForgotPasswordEmail('');
            setResetCode('');
            setNewPassword('');
            setNewPasswordConfirmation('');
            setForgotPasswordStep('email');
          }
        } catch (loginError) {
          toast.error(loginError.response?.data?.message || 'فشل تسجيل الدخول التلقائي');
          setShowForgotPassword(false);
          setForgotPasswordEmail('');
          setResetCode('');
          setNewPassword('');
          setNewPasswordConfirmation('');
          setForgotPasswordStep('email');
        }
      } else {
        toast.error(response.data.message || 'فشل إعادة تعيين كلمة المرور');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل إعادة تعيين كلمة المرور');
    }
  };

  return (
    <GoogleOAuthProvider clientId="3201353521-e2lqmevi9saub0tupci7bic7cjda534m.apps.googleusercontent.com">
      <div className="relative">
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#121a2e] p-6 rounded-lg w-[90%] sm:max-w-md">
              <h2 className="text-2xl mb-4 text-gray-600 dark:text-white">إعادة تعيين كلمة المرور</h2>

              {forgotPasswordStep === 'email' && (
                <>
                  <input
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-500 bg-white text-gray-600 dark:bg-[#121a2e] dark:text-white mb-4"
                    placeholder="أدخل بريدك الإلكتروني"
                    required
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowForgotPassword(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleForgotPasswordEmail}
                      className="px-4 py-2 bg-red-600 text-white rounded-md"
                    >
                      إرسال رمز إعادة التعيين
                    </button>
                  </div>
                </>
              )}

              {forgotPasswordStep === 'code' && (
                <>
                  <input
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-500 bg-white text-gray-600 dark:bg-[#121a2e] dark:text-white mb-4"
                    placeholder="أدخل رمز إعادة التعيين"
                    required
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setForgotPasswordStep('email');
                        setResetCode('');
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md"
                    >
                      العودة
                    </button>
                    <button
                      onClick={handleVerifyResetCode}
                      className="px-4 py-2 bg-red-600 text-white rounded-md"
                    >
                      التحقق من الرمز
                    </button>
                  </div>
                </>
              )}

              {forgotPasswordStep === 'newPassword' && (
                <>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-500 bg-white text-gray-600 dark:bg-[#121a2e] dark:text-white mb-4"
                    placeholder="كلمة المرور الجديدة"
                    required
                  />
                  <input
                    type="password"
                    value={newPasswordConfirmation}
                    onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-500 bg-white text-gray-600 dark:bg-[#121a2e] dark:text-white mb-4"
                    placeholder="تأكيد كلمة المرور الجديدة"
                    required
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setForgotPasswordStep('code');
                        setNewPassword('');
                        setNewPasswordConfirmation('');
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md"
                    >
                      العودة
                    </button>
                    <button
                      onClick={handleResetPassword}
                      className="px-4 py-2 bg-red-600 text-white rounded-md"
                    >
                      إعادة تعيين كلمة المرور
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4">
          <div className="inline-flex items-center gap-2 mb-2 mt-10">
            <p className="text-3xl">{currentState}</p>
            <hr className="border-none h-[1.5px] w-8" />
          </div>
          {currentState === 'إنشاء حساب' && (
            <>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-500 bg-white text-gray-600 dark:bg-[#121a2e] dark:text-white"
                placeholder="الاسم الأول"
                required
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-500 bg-white text-gray-600 dark:bg-[#121a2e] dark:text-white"
                placeholder="الاسم الأخير"
                required
              />
            </>
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-500 bg-white text-gray-600 dark:bg-[#121a2e] dark:text-white px-3 py-2"
            placeholder="البريد الإلكتروني"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-500 bg-white text-gray-600 dark:bg-[#121a2e] dark:text-white"
            placeholder="كلمة المرور"
            required
          />
          {currentState === 'إنشاء حساب' && (
            <>
              <input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-500 bg-white text-gray-600 dark:bg-[#121a2e] dark:text-white"
                placeholder="تأكيد كلمة المرور"
                required
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-500 bg-white text-gray-600 dark:bg-[#121a2e] dark:text-white"
                placeholder="رقم الهاتف"
                required
              />
            </>
          )}
          <div className="w-full flex justify-between text-sm mt-[-8px]">
            <p
              onClick={() => setShowForgotPassword(true)}
              className="cursor-pointer"
            >
              نسيت كلمة المرور؟
            </p>
            {currentState === "تسجيل الدخول" ? (
              <p onClick={() => handleStateToggle('إنشاء حساب')} className="cursor-pointer">
                إنشاء حساب
              </p>
            ) : (
              <p onClick={() => handleStateToggle('تسجيل الدخول')} className="cursor-pointer">
                تسجيل الدخول هنا
              </p>
            )}
          </div>
          <button className="rounded-md w-52 bg-red-600 text-white font-light px-8 py-2 mt-4">
            {currentState === "تسجيل الدخول" ? "تسجيل الدخول" : "إنشاء حساب"}
          </button>

          {currentState === 'تسجيل الدخول' && (
            <div className="mt-4">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginFailure}
                buttonText="تسجيل الدخول بجوجل"
              />
            </div>
          )}
        </form>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;

//? ========= end API ===========
//? ========= end API ===========