"use client";
import axios from 'axios';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../auth.module.css';
import Navigation from '../../../components/Navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthContext } from '@/contexts/AuthProvider';
import { useNotification } from '@/contexts/NotificationProvider';

const SignIn = () => {
  const Router = useRouter();
  const { setUserInfo } = useAuthContext();
  const{ pushNotification } = useNotification();
  
  const [email, setEmail] = useState("211400068@gift.edu.pk");
  const [password, setPassword] = useState("1234567");

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

      const response = await axios.post('/api/auth/login', {  uid: user.uid, email });
      
      if (200 === response.status) {
        const { type, message, user } = response.data;
        console.log(user);
        
        pushNotification(type, message);
        
        setUserInfo(user);
        
        Router.push("/fill-resume");
        setEmail("");
        setPassword("");
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

          <input
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
            <input
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
        <span className={styles["alternative-option-message"]}>or</span>
        <button type="button" className={styles['sign-in-with-email-btn']} disabled={isLoading}>Login with Email Link</button>
        <Link className={styles['sign-up-form-link']} href="/sign-up">Don't have an account?</Link>
      </form>
    </div>
  );
}

export default SignIn;