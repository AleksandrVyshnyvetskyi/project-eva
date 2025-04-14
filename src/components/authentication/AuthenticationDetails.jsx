import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { auth } from "../../firebase/firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../common/Button";

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
        navigate("/");
        toast.success(`👋 Ви успішно вийшли!`);
      })
      .catch((error) => {
        toast.error(`❌ Помилка - ${error.message}`);
      });
  };

  return (
    <div>
      {authUser ? (
        <Button variant="outBtn" onClick={userOut}>Вийти</Button>
      ) : (
        ""
      )}
    </div>
  );
};

export default AuthenticationDetails;
