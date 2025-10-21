
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/AuthProvider';
import { AtlasLogo, GoogleIcon, PhoneIcon } from '../components/icons';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { auth } from '../services/firebase';

type AuthMethod = 'email' | 'phone';

const LoginView: React.FC = () => {
    const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const [otpSent, setOtpSent] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

    const { login, signup, signInWithGoogle, signInWithPhone } = useAuth();
    const recaptchaContainerRef = useRef<HTMLDivElement>(null);

    // Setup reCAPTCHA verifier
    useEffect(() => {
        if (authMethod === 'phone' && recaptchaContainerRef.current && !(window as any).recaptchaVerifier) {
            (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
                'size': 'invisible',
                'callback': (response: any) => {},
            });
        }
    }, [authMethod]);
    
    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);
        try {
            await signInWithGoogle();
        } catch (err: any) {
            setError(err.message || 'Failed to sign in with Google.');
        }
        setLoading(false);
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password).catch(async (loginError) => {
                 if (loginError.code === 'auth/user-not-found' || loginError.code === 'auth/wrong-password') {
                    // Try signing up if login fails, for a seamless experience
                    return await signup(email, password);
                 }
                 throw loginError;
            });
        } catch (err: any) {
            setError(err.message || 'Failed to authenticate. Please check your credentials.');
        }
        setLoading(false);
    };
    
    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const verifier = (window as any).recaptchaVerifier;
            const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
            const result = await signInWithPhone(formattedPhone, verifier);
            setConfirmationResult(result);
            setOtpSent(true);
        } catch(err: any) {
            setError(err.message || 'Failed to send OTP. Ensure phone number is valid and includes country code (e.g., +15551234567).');
            const recaptcha = (window as any).recaptchaVerifier;
            if (recaptcha) {
                recaptcha.render().then((widgetId: any) => {
                    (window as any).grecaptcha?.reset(widgetId);
                });
            }
        }
        setLoading(false);
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
         e.preventDefault();
         setError('');
         setLoading(true);
         if (!confirmationResult) {
            setError("Something went wrong. Please try sending the code again.");
            setLoading(false);
            return;
         }
         try {
            await confirmationResult.confirm(otp);
         } catch(err: any) {
             setError(err.message || 'Failed to verify OTP. The code may be incorrect or expired.');
         }
         setLoading(false);
    };
    
    const renderEmailForm = () => (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email Address</label>
                <Input id="email" type="email" placeholder="name@company.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
                <label htmlFor="password"  className="text-sm font-medium text-muted-foreground">Password</label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Authenticating...' : 'Continue with Email'}
            </Button>
        </form>
    );
    
    const renderPhoneForm = () => (
        <>
            {!otpSent ? (
                 <form onSubmit={handlePhoneSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium text-muted-foreground">Phone Number</label>
                        <Input id="phone" type="tel" placeholder="+1 555-123-4567" required value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Sending Code...' : 'Send Verification Code'}
                    </Button>
                </form>
            ) : (
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                    <p className="text-sm text-center text-muted-foreground">Enter the 6-digit code sent to {phone}.</p>
                    <div className="space-y-2">
                        <label htmlFor="otp" className="text-sm font-medium text-muted-foreground">Verification Code</label>
                        <Input id="otp" type="text" inputMode="numeric" placeholder="123456" required value={otp} onChange={(e) => setOtp(e.target.value)} />
                    </div>
                     <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify & Sign In'}
                    </Button>
                    <Button variant="link" size="sm" onClick={() => { setOtpSent(false); setError(''); }} className="w-full text-muted-foreground">
                        Use a different number
                    </Button>
                </form>
            )}
        </>
    );

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
             <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
            <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-lg border bg-card overflow-hidden shadow-2xl shadow-primary/10">
                <div className="p-8 md:p-12 order-2 md:order-1 flex flex-col justify-center">
                     <div className="flex items-center gap-3 mb-6">
                         <AtlasLogo className="h-8 w-8 text-primary" />
                         <h1 className="text-2xl font-bold">Sign in to ATLAS</h1>
                    </div>
                    {error && <p className="text-center text-sm text-destructive bg-destructive/10 p-3 rounded-md mb-4">{error}</p>}
                    
                    <div className="flex gap-2 mb-6">
                        <Button variant={authMethod === 'email' ? 'default' : 'outline'} className="w-full gap-2" onClick={() => setAuthMethod('email')}>
                           Email & Password
                        </Button>
                        <Button variant={authMethod === 'phone' ? 'default' : 'outline'} className="w-full gap-2" onClick={() => setAuthMethod('phone')}>
                            <PhoneIcon className="h-4 w-4"/> Phone
                        </Button>
                    </div>

                    {authMethod === 'email' ? renderEmailForm() : renderPhoneForm()}

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
                    </div>
                    
                    <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
                        <GoogleIcon className="mr-2 h-5 w-5" />
                        Sign in with Google
                    </Button>
                </div>
                 <div className="hidden md:block bg-muted p-12 order-1 md:order-2">
                    <div className="flex flex-col justify-center h-full text-center">
                        <AtlasLogo className="h-20 w-20 text-primary mx-auto mb-4" />
                        <h2 className="text-2xl font-bold">Cognitive Intelligence Unlocked</h2>
                        <p className="mt-2 text-muted-foreground">Your workspace, now proactive and intelligent.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginView;
