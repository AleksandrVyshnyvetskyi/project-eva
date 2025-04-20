import { Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes";
import style from "./styles/Header.module.css";
import AuthenticationDetails from "./components/authentication/AuthenticationDetails";
import { useAuth } from "./context/AuthContext";
import Footer from "./components/Footer/Footer";
import stylesFooter from "./styles/Footer.module.css";
import { useEffect, useState } from "react";

function AppContent() {
    const { role } = useAuth();
    const [theme, setTheme] = useState("dark");
    const allowedRoles = ["admin", "creater"];
    const canViewNav = allowedRoles.includes(role);

    useEffect(() => {
        const saved = localStorage.getItem("theme") || "dark";
        setTheme(saved);
        document.documentElement.className = saved;
    }, []);
    
    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.className = newTheme;
    };

    return (
        <>
            <section className={style.container}>
                <h2 className={style.title}>ЕВА</h2>

                <nav>
                    <input type="checkbox" className={style.themeCheckbox} checked={theme === "dark"} onChange={toggleTheme}/>
                    {canViewNav && (
                        <>
                            <Link className={style.link} to="/">
                                Головна
                            </Link>
                            <Link className={style.link} to="/sales">
                                Продажі
                            </Link>
                            <Link className={style.link} to="/repairs">
                                Сервіс
                            </Link>
                            <Link className={style.link} to="/analytics">
                                Статистика
                            </Link>
                            <Link className={style.link} to="/user">
                                Мій профіль
                            </Link>
                            <Link className={style.link} to="/creater">
                                Панель адміністратора
                            </Link>
                        </>
                    )}
                    <AuthenticationDetails />
                </nav>
            </section>

            <section className={style.homeContainer}>
                <AppRoutes />
            </section>
            <section className={stylesFooter.section}>
                <Footer />
            </section>
        </>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
