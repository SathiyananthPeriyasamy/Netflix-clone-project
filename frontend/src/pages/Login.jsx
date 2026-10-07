import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Lock, Mail, Phone, AlertCircle, ArrowRight, ShieldCheck, Terminal, Smartphone, MailCheck, ExternalLink, KeyRound, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const navigate = useNavigate();
  const [loginMode, setLoginMode] = useState('password'); // 'password' | 'otp' | 'forgot'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // OTP Login states
  const [otpStep, setOtpStep] = useState(1);
  const [otpInput, setOtpInput] = useState('');

  // Forgot Password states
  const [resetStep, setResetStep] = useState(1); // 1: send OTP, 2: verify & set password
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loginWithPassword, sendLoginOtp, verifyLoginOtp, sendResetPasswordOtp, resetPassword, loginWithGoogle } = useContext(AuthContext);

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);
    const result = await loginWithGoogle();
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Google Sign-In failed');
    }
  };

  // Password Login Handler

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    const result = await loginWithPassword(identifier, password);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Login failed');
    }
  };

  // Request Real-Time OTP for Login
  const handleSendLoginOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    if (!identifier) {
      setIsSubmitting(false);
      setError('Please enter your registered Email Address or Phone Number');
      return;
    }

    const result = await sendLoginOtp(identifier);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Failed to send login OTP');
      return;
    }

    setPreviewUrl(result.previewUrl || null);
    setOtpStep(2);
  };

  // Verify Real-Time Login OTP
  const handleVerifyLoginOtp = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await verifyLoginOtp(identifier, otpInput);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Invalid OTP code');
      return;
    }

    window.location.reload();
  };

  // Request Password Reset OTP
  const handleSendResetOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    if (!identifier) {
      setIsSubmitting(false);
      setError('Please enter your registered Email Address or Phone Number');
      return;
    }

    const result = await sendResetPasswordOtp(identifier);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Failed to send reset OTP');
      return;
    }

    setPreviewUrl(result.previewUrl || null);
    setResetStep(2);
  };

  // Submit New Password with Reset OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    if (!resetOtp || resetOtp.length < 6) {
      setIsSubmitting(false);
      setError('Please enter the full 6-digit OTP code sent to your mail/phone');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setIsSubmitting(false);
      setError('New password must be at least 6 characters long');
      return;
    }

    const result = await resetPassword(identifier, resetOtp, newPassword);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Password reset failed');
      return;
    }

    setPassword(newPassword);
    setSuccessMsg(result.message || 'Password reset successfully! You can now sign in.');
    setLoginMode('password');
    setResetStep(1);
    setResetOtp('');
    setNewPassword('');
  };

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center flex flex-col justify-between text-white font-sans"
      style={{
        backgroundImage: `url('https://assets.nflxext.com/ffe/siteui/vlv3/594ce3a3-d308-4929-92c7-010df04430e8/e60a9907-f27a-4286-[us]-perspective_alpha_website_large.jpg')`,
      }}
    >
      <div className="absolute inset-0 bg-black/75 bg-gradient-to-t from-black via-black/40 to-black/80" />

      {/* Header */}
      <header className="relative z-20 px-6 md:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#E50914] font-black text-3xl tracking-tighter">NETFLIX</span>
        </div>
      </header>

      {/* Main Login / Reset Box */}
      <main className="relative z-20 flex justify-center items-center px-4 my-8">
        <div className="w-full max-w-md bg-black/80 backdrop-blur-xl p-8 md:p-10 rounded-2xl border border-white/10 shadow-2xl animate-fade-in">

          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-extrabold text-white">
              {loginMode === 'forgot' ? 'Reset Password' : 'Sign In'}
            </h1>
            {loginMode === 'forgot' && (
              <span className="bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/40 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                SECURITY RESET
              </span>
            )}
          </div>

          <p className="text-gray-400 text-xs mb-6">
            {loginMode === 'forgot'
              ? 'Verification OTP will be sent from no-reply@netflix.com'
              : 'Choose your preferred authentication method.'}
          </p>

          {/* Continue with Google SSO Button */}
          {loginMode !== 'forgot' && (
            <div className="mb-6 space-y-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full bg-[#0a66c2] hover:bg-[#084e96] text-white font-bold py-3 px-4 rounded-full flex items-center justify-center gap-3 shadow-lg transition-all duration-200 active:scale-[0.98] border border-white/10 disabled:opacity-50"
              >
                <div className="bg-white p-1 rounded-full flex items-center justify-center shadow-inner">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-semibold tracking-wide">Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-white/15"></div>
                <span className="bg-black/90 px-3 text-[11px] text-gray-400 font-bold uppercase tracking-widest shrink-0">OR</span>
                <div className="w-full border-t border-white/15"></div>
              </div>
            </div>
          )}

          {/* Login Mode Toggle Tabs (Password vs OTP vs Forgot) */}

          <div className="grid grid-cols-2 gap-2 p-1 bg-[#222222] rounded-xl mb-6 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setLoginMode('password');
                setError('');
                setSuccessMsg('');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${loginMode === 'password'
                  ? 'bg-[#E50914] text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Password Login</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginMode('otp');
                setOtpStep(1);
                setError('');
                setSuccessMsg('');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${loginMode === 'otp'
                  ? 'bg-[#E50914] text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>OTP Login</span>
            </button>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="mb-6 p-3.5 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center gap-2.5 animate-fade-in shadow-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* MODE 1: PASSWORD LOGIN */}
          {loginMode === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Email or Phone Number</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your email or phone number"
                    className="w-full bg-[#222222] text-white rounded-lg px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E50914] border border-white/10"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-300 uppercase">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode('forgot');
                      setResetStep(1);
                      setError('');
                      setSuccessMsg('');
                    }}
                    className="text-xs text-gray-400 hover:text-[#E50914] hover:underline transition-colors font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-[#222222] text-white rounded-lg px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E50914] border border-white/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full netflix-btn-red py-3 justify-center font-bold text-base mt-2 shadow-lg hover:shadow-[0_0_20px_rgba(229,9,20,0.6)]"
              >
                {isSubmitting ? 'Authenticating...' : 'Sign In with Password'}
              </button>
            </form>
          )}

          {/* MODE 2: REAL-TIME OTP LOGIN */}
          {loginMode === 'otp' && (
            <>
              {otpStep === 1 ? (
                <form onSubmit={handleSendLoginOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Registered Email or Phone Number</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="Enter your registered email or phone number"
                        className="w-full bg-[#222222] text-white rounded-lg px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E50914] border border-white/10"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full netflix-btn-red py-3 justify-center font-bold text-base mt-2 shadow-lg hover:shadow-[0_0_20px_rgba(229,9,20,0.6)]"
                  >
                    {isSubmitting ? 'Sending OTP...' : 'Send OTP to Email / Phone'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyLoginOtp} className="space-y-4 animate-fade-in">
                  <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs space-y-2 shadow-lg">
                    <div className="flex items-center gap-2 font-bold text-emerald-400">
                      <MailCheck className="w-4 h-4" />
                      <span>OTP Sent Successfully!</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      A 6-digit OTP verification code has been sent to <strong className="text-white">{identifier}</strong>. Please check your inbox / messages.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="w-full bg-[#222222] text-center font-mono font-bold text-2xl tracking-[0.4em] text-white rounded-xl py-3 focus:outline-none focus:ring-2 focus:ring-[#E50914] border border-white/10"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || otpInput.length < 6}
                    className="w-full netflix-btn-red py-3 justify-center font-bold text-base shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify OTP & Sign In'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOtpStep(1)}
                    className="w-full text-xs text-gray-400 hover:text-white pt-2"
                  >
                    ← Change email/phone number
                  </button>
                </form>
              )}
            </>
          )}

          {/* MODE 3: FORGOT PASSWORD DIV / CONTAINER */}
          {loginMode === 'forgot' && (
            <div className="bg-[#181818] p-5 rounded-xl border border-white/10 shadow-inner animate-fade-in space-y-4">
              <div className="flex items-center gap-2 text-[#E50914] text-sm font-bold border-b border-white/10 pb-3">
                <KeyRound className="w-4 h-4" />
                <span>Account Password Recovery</span>
              </div>

              {resetStep === 1 ? (
                <form onSubmit={handleSendResetOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                      Registered Email or Phone Number
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="Enter registered email or phone number"
                        className="w-full bg-[#222222] text-white rounded-lg px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E50914] border border-white/10"
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1.5">
                      We will verify your account in the DB and send a 6-digit OTP code from <strong className="text-gray-200">no-reply@netflix.com</strong>.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full netflix-btn-red py-3 justify-center font-bold text-sm shadow-lg hover:shadow-[0_0_20px_rgba(229,9,20,0.6)]"
                  >
                    {isSubmitting ? 'Verifying & Sending OTP...' : 'Send Password Reset Code'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode('password');
                      setError('');
                      setSuccessMsg('');
                    }}
                    className="w-full text-xs text-gray-400 hover:text-white pt-1 text-center"
                  >
                    ← Back to Sign In
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4 animate-fade-in">
                  <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs space-y-1.5 shadow-md">
                    <div className="flex items-center gap-2 font-bold text-emerald-400">
                      <MailCheck className="w-4 h-4" />
                      <span>Reset OTP Dispatched!</span>
                    </div>
                    <p className="text-gray-300 text-[11px]">
                      A 6-digit reset code has been sent to <strong className="text-white">{identifier}</strong>.
                    </p>

                    <button
                      type="button"
                      onClick={handleSendResetOtp}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-1.5 mt-2 bg-gray-700 hover:bg-gray-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
                    >
                      <span>Resend OTP</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Enter 6-Digit OTP Code</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={resetOtp}
                      onChange={(e) => setResetOtp(e.target.value)}
                      placeholder="6-digit code"
                      className="w-full bg-[#222222] text-center font-mono font-bold text-xl tracking-[0.3em] text-white rounded-lg py-2.5 focus:outline-none focus:ring-2 focus:ring-[#E50914] border border-white/10"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Set New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimum 8 characters"
                        className="w-full bg-[#222222] text-white rounded-lg px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E50914] border border-white/10"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
                      Must be at least <strong className="text-gray-300">8 characters</strong> long, including <strong className="text-gray-300">1 uppercase letter</strong>, <strong className="text-gray-300">1 lowercase letter</strong>, <strong className="text-gray-300">1 number</strong>, and <strong className="text-gray-300">1 special character</strong>.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || resetOtp.length < 6 || newPassword.length < 6}
                    className="w-full netflix-btn-red py-3 justify-center font-bold text-sm shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? 'Updating Password...' : 'Reset Password & Update Account'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setResetStep(1)}
                    className="w-full text-xs text-gray-400 hover:text-white pt-1 text-center"
                  >
                    ← Change Email / Phone Number
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="mt-6 text-sm text-gray-400 flex items-center justify-between">
            <span>New to Netflix?</span>
            <button
              onClick={() => navigate('/signup')}
              className="text-white hover:underline font-semibold flex items-center gap-1 text-xs"
            >
              Sign up now <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>

      <footer className="relative z-20 px-6 py-4 bg-black/80 text-center text-xs text-gray-500 border-t border-white/5">
        © 2026 Netflix Clone. All rights reserved.
      </footer>
    </div>
  );
};
