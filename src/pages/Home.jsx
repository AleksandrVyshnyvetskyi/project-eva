import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { ToastContainer } from "react-toastify";
import Authentication from "../components/authentication/Authentication";
import style from "../styles/Home.module.css";

const Home = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe(); 
    }, []);

    if (loading) return null;

    return (
        <>
            <h1>
                Привіт, я Ева - твоя помічниця по:
                <br />
                <span className={style.accent}>Е</span>лектронним продажам,
                <br />
                <span className={style.accent}>В</span>ідправок в сервіс,
                <br />
                <span className={style.accent}>А</span>налітиці
            </h1>

            <div className={style.container}>
                {!user && <Authentication />}
            </div>

            <ToastContainer />
        </>
    );
};

export default Home;
