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

  const { sendSignupOtp, verifySignupOtp, resetDatabase } = useContext(AuthContext);

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
          <span className="text-[#E50914] font-black text-3xl tracking-tighter">PRIME</span>
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
            className="prime-btn-red text-xs py-1.5 px-4 font-semibold"
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
              <p className="text-gray-400 text-xs mb-6">Enter your details to receive security verification code.</p>

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
                  className="w-full prime-btn-red py-3 justify-center font-bold text-base mt-2 shadow-lg hover:shadow-[0_0_20px_rgba(229,9,20,0.6)]"
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
                  A 6-digit OTP verification code has been sent to <strong className="text-white">{email}</strong>. Please check your email inbox to read the code.
                </p>

                {previewUrl && (
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold px-3 py-1.5 rounded-lg text-xs transition-colors"
                  >
                    <span>Open Mail Webmail Inbox Preview</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
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
                  className="w-full prime-btn-red py-3 justify-center font-bold text-base shadow-lg disabled:opacity-50"
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
        © 2026 Prime Clone. All rights reserved.
      </footer>
    </div>
  );
};
