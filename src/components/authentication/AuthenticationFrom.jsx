import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
// import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from '../../firebase/firebase'
import { getUserData } from '../../firebase/userService';
import Button from '../common/Button';
import Field from '../common/Field';
import styles from '../../styles/Authentication.module.css'
import Loader from '../loader/Loader'

const AuthenticationForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

   

    const login = (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("⚠️ Введіть email і пароль");
            return;
          }

        setIsLoading(true);

        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                const profileData = await getUserData(user.uid);

                toast.success(`👋 Привіт, ${profileData?.name || "користувач"}!`);
                setEmail('');
                setPassword('');
                setIsLoggedIn(true);
            })
            .catch((error) => {
                console.log(error);
                toast.error(`❌ Помилка - ${error}`);
            })
            .finally(() => setIsLoading(false));
        }


        const register = async (e) => {
            e.preventDefault();
            if (!email || !password) {
              toast.error("⚠️ Введіть email і пароль");
              return;
            }
          
            setIsLoading(true);
          
            try {
              const userCredential = await createUserWithEmailAndPassword(auth, email, password);
              const user = userCredential.user;
          
              await setDoc(doc(db, "users", user.uid), {
                name: "Новий користувач",
                email: email,
                role: "viewer"
              });
          
              toast.success("✅ Вас зареєстровано !");
              setEmail('');
              setPassword('');
              setIsLoggedIn(true);
            } catch (error) {
              if (error.code === "auth/email-already-in-use") {
                toast.error("❌ Ви вже зареєстровані");
              } else {
                toast.error(`❌ Помилка - ${error.message}`);
              }
            } finally {
              setIsLoading(false);
            }
          };

    if (isLoading) return <Loader />;

    if (isLoggedIn) return ('');

    return (
        <form onSubmit={login} className={styles.form}>
            <p className={styles.heading}>Вхід до системи <span className={styles.accent}>ЕВА</span></p>
            <div className={styles.field}>
                <svg className={styles.inputIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"></path>
                </svg>
                <Field type="email" className="loginInput" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="on" placeholder="ім'я@Пошта"/>
            </div>
            <div className={styles.field}>
                <svg className={styles.inputIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
                </svg>
                <Field type="password" className="loginInput" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="on" placeholder="Пароль"/>
            </div>
            <div className={styles.btn}>
                <Button variant='buttonAuthentication'>Вхід</Button>
                <Button variant='buttonAuthentication' onClick={register}>Реєстрація</Button>
            </div>
            {/* <Button variant='buttonForgotPassword'>Забули пароль ?</Button> */}
        </form>
    )
}

export default AuthenticationForm;