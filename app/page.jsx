"use client";
import Link from 'next/link';
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import styles from './auth.module.css';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation.tsx';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useNotification } from '@/contexts/NotificationProvider';
import { Input } from '@/components/ui/input';

const SignIn = () => {
  const Router = useRouter();
  const{ pushNotification } = useNotification();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      pushNotification("warning", "Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      if (user.uid === process.env.NEXT_PUBLIC_FIREBASE_ADMIN_UID) {
        pushNotification("success", "Logged in successfully!");
        // onAuthStateChanged will automatically update userInfo, no need to set it manually
        Router.push("/dashboard/");
        setEmail("");
        setPassword("");
      } else {
        // If not the admin user, sign them out
        await signOut(auth);
        pushNotification("error", "Access denied. Admin access required.");
      }
    } catch (error) {
      if (error.code) {
        switch (error.code) {
          case "auth/invalid-credential":
            pushNotification("error", "This email or password is incorrect.");
            break;
          default:
            pushNotification("error", "An unexpected error occurred. Please try again later.");
            break;
        }
      } else {
        pushNotification("error", error.response?.data?.message || "An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='w-screen h-screen relative'>
      <Navigation />
      <form className={`${styles["sign-in-form"]} mt-20`} onSubmit={handleRegisterUser}>
        <header className={styles.header}>Login</header>

        {/* Email */}
        <div className={styles.field}>
          <label>Email</label>

          <Input
            required
            type="email"
            value={email}
            inputMode='email'
            className='form-input'
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className={styles.field}>
          <label>Password</label>
          
          <div className='icon-field'>
            <Input
              required
              minLength={7}
              value={password}
              className='form-input'
              type={showPassword ? "text" : "password"}
              onChange={e => setPassword(e.target.value)}
            />

            <button type='button' className={styles['show-pass-btn']} onClick={() => setShowPassword(!showPassword)}>
              <span className="material-symbols-outlined">{showPassword ? "visibility" : "visibility_off"}</span>
            </button>
          </div>
        </div>
        <Link className={styles['forgot-password-link']} href="">Forgot Password?</Link>

        {/* Submit */}
        <button type="submit" className={styles["sign-in-btn"]} disabled={isLoading}>Login</button>
      </form>
    </div>
  );
}

export default SignIn;
