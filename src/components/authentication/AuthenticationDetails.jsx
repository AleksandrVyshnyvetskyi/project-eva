import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from '../../styles/Header.module.css';

const AuthenticationDetails = () => {
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });
    return () => {
      listen();
    };
  }, []);

  const userOut = () => {
    signOut(auth)
      .then(() => {
        toast.success(`👋 Ви успішно вийшли!`);
        navigate("/");
      })
      .catch((error) => {
        toast.error(`❌ Помилка - ${error.message}`);
      });
  };

  return (
    <div>
      {authUser ? (
        <button className={styles.outBtn} onClick={userOut}>
          Вийти
        </button>
      ) : (
        ""
      )}
    </div>
  );
};

export default AuthenticationDetails;
