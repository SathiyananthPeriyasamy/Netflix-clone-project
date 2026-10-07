import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Phone, Lock, AlertCircle, RefreshCw, ShieldCheck, LogIn, Trash2, ExternalLink, MailCheck, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Step state (1: info form, 2: OTP screen)
  const [step, setStep] = useState(1);
  const [otpInput, setOtpInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const { sendSignupOtp, verifySignupOtp, resetDatabase, loginWithGoogle } = useContext(AuthContext);

  const handleGoogleSignIn = async () => {
    setError('');
    setIsSubmitting(true);
    const result = await loginWithGoogle();
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Google Sign-Up failed');
    }
  };


  useEffect(() => {
    let interval = null;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Password complexity checks
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  // Request Real-Time OTP for Registration
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (!email || !phone) {
      setError('Please provide both Email Address and Mobile Phone Number.');
      return;
    }

    const digitsOnly = phone.replace(/[^0-9]/g, '');
    if (digitsOnly.length < 10 || /[^0-9+]/.test(phone)) {
      setError('Mobile phone number must contain only numbers and be at least 10 digits.');
      return;
    }

    if (!hasMinLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      setError('Password does not meet the security requirements (Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character).');
      return;
    }

    setIsSubmitting(true);
    const result = await sendSignupOtp(name, email, phone, password);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Validation failed. Please check your details.');
      return;
    }

    setPreviewUrl(result.previewUrl || null);
    setInfoMessage(result.message || `A 6-digit OTP verification code has been sent to ${email}`);
    setStep(2);
    setResendTimer(60);
  };

  // Verify OTP and Complete Account Signup
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await verifySignupOtp(email, otpInput);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'OTP verification failed. Please check your email inbox.');
      return;
    }

    window.location.reload();
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setError('');
    setIsSubmitting(true);
    const result = await sendSignupOtp(name, email, phone, password);
    setIsSubmitting(false);

    if (result.success) {
      setPreviewUrl(result.previewUrl || null);
      setInfoMessage(`New 6-digit OTP code sent to ${email}`);
      setResendTimer(60);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center flex flex-col justify-between text-white font-sans"
      style={{
        backgroundImage: `url('https://assets.nflxext.com/ffe/siteui/vlv3/594ce3a3-d308-4929-92c7-010df04430e8/e60a9907-f27a-4286-[us]-perspective_alpha_website_large.jpg')`,
      }}
    >
      <div className="absolute inset-0 bg-black/75 bg-gradient-to-t from-black via-black/50 to-black/80" />

      {/* Header */}
      <header className="relative z-20 px-6 md:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#E50914] font-black text-3xl tracking-tighter">NETFLIX</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetDatabase}
            className="text-xs text-red-400 hover:text-red-300 border border-red-500/40 bg-red-500/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition-colors"
            title="Delete all existing users from database and start fresh"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset DB (Delete All Users)</span>
          </button>
          <button
            onClick={() => navigate('/signin')}
            className="netflix-btn-red text-xs py-1.5 px-4 font-semibold"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-20 flex justify-center items-center px-4 my-8">
        <div className="w-full max-w-md bg-black/80 backdrop-blur-xl p-8 md:p-10 rounded-2xl border border-white/10 shadow-2xl animate-fade-in">
          
          {step === 1 ? (
            /* STEP 1: Registration Form */
            <>
              <h1 className="text-3xl font-extrabold text-white mb-2">Create Account</h1>
              <p className="text-gray-400 text-xs mb-6">Enter your details or continue with your Google account.</p>

              {/* Continue with Google SSO Button */}
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


              {/* DUPLICATE / ERROR ALERT BANNER */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-xs space-y-2 animate-fade-in">
                  <div className="flex items-center gap-2 font-bold text-red-300">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Validation Failed</span>
                  </div>
                  <p className="text-gray-200 leading-relaxed">{error}</p>
                  
                  {error.includes('already exists') && (
                    <button
                      type="button"
                      onClick={() => navigate('/signin')}
                      className="mt-2 w-full bg-[#E50914] hover:bg-[#F40612] text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Click Here to Sign In Now</span>
                    </button>
                  )}
                </div>
              )}

              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full bg-[#222222] text-white rounded-lg px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E50914] border border-white/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full bg-[#222222] text-white rounded-lg px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E50914] border border-white/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Mobile Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      required
                      inputMode="numeric"
                      pattern="[0-9+]*"
                      value={phone}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9+]/g, '');
                      }}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, ''))}
                      placeholder="Enter mobile phone number"
                      className="w-full bg-[#222222] text-white rounded-lg px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E50914] border border-white/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Create Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full bg-[#222222] text-white rounded-lg px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E50914] border border-white/10"
                    />
                  </div>

                  {/* LIVE PASSWORD STRENGTH CRITERIA BADGES */}
                  <div className="mt-2.5 p-2.5 bg-[#181818] rounded-lg border border-white/5 space-y-1.5 text-[11px]">
                    <p className="text-gray-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">Password Security Requirements:</p>
                    <div className="grid grid-cols-2 gap-1.5 text-gray-300">
                      <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400 font-semibold' : 'text-gray-400'}`}>
                        {hasMinLength ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 shrink-0 text-gray-500" />}
                        <span>At least 8 characters</span>
                      </div>

                      <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-400 font-semibold' : 'text-gray-400'}`}>
                        {hasUpper ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 shrink-0 text-gray-500" />}
                        <span>Uppercase (A-Z)</span>
                      </div>

                      <div className={`flex items-center gap-1.5 ${hasLower ? 'text-emerald-400 font-semibold' : 'text-gray-400'}`}>
                        {hasLower ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 shrink-0 text-gray-500" />}
                        <span>Lowercase (a-z)</span>
                      </div>

                      <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400 font-semibold' : 'text-gray-400'}`}>
                        {hasNumber ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 shrink-0 text-gray-500" />}
                        <span>One Number (0-9)</span>
                      </div>

                      <div className={`flex items-center gap-1.5 col-span-2 ${hasSpecial ? 'text-emerald-400 font-semibold' : 'text-gray-400'}`}>
                        {hasSpecial ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 shrink-0 text-gray-500" />}
                        <span>One Special Character (!@#$%^&*)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full netflix-btn-red py-3 justify-center font-bold text-base mt-2 shadow-lg hover:shadow-[0_0_20px_rgba(229,9,20,0.6)]"
                >
                  {isSubmitting ? 'Verifying & Sending OTP...' : 'Send OTP Code'}
                </button>
              </form>
            </>
          ) : (
            /* STEP 2: Verification Screen - OTP strictly hidden from website */
            <>
              <div className="flex items-center gap-2 mb-2 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
                <span className="text-xs font-bold uppercase tracking-wider">Security Code Dispatched</span>
              </div>

              <h1 className="text-2xl font-extrabold text-white mb-2">Check Your Email / Messages</h1>
              
              <div className="mb-4 p-4 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs space-y-2 shadow-lg">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <MailCheck className="w-4 h-4" />
                  <span>OTP Sent Successfully!</span>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  A 6-digit OTP verification code has been sent to <strong className="text-white">{email}</strong> & <strong className="text-white">{phone}</strong>. Please check your inbox / messages.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-5">
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
                  {isSubmitting ? 'Verifying OTP...' : 'Verify OTP & Complete Registration'}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between text-xs border-t border-white/10 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ← Edit signup info
                </button>

                <button
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0}
                  className={`flex items-center gap-1.5 font-semibold ${
                    resendTimer > 0 ? 'text-gray-500 cursor-not-allowed' : 'text-[#E50914] hover:underline'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}</span>
                </button>
              </div>
            </>
          )}

          <div className="mt-6 text-sm text-gray-400 text-center">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/signin')}
              className="text-white hover:underline font-semibold"
            >
              Sign In
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
