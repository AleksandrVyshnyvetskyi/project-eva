import { Link } from 'react-router-dom';
import { AuthProvider } from "./contex/AuthContext";
import AppRoutes from './routes';
import style from './styles/Header.module.css';
import AuthenticationDetails from './components/authentication/AuthenticationDetails';
import { useAuth } from "./contex/AuthContext";
import Footer from './components/Footer/Footer';
import stylesFooter from './styles/Footer.module.css'

function AppContent() {
  const { role } = useAuth();

  const allowedRoles = ["admin", "creater"];
  const canViewNav = allowedRoles.includes(role);

  return (
    <>
      <section className={style.container}>
        <h2 className={style.title}>ЕВА</h2>

        
          <nav>
          {canViewNav && (<>
            <Link className={style.link} to="/">Головна</Link>
            <Link className={style.link} to="/sales">Продажі</Link>
            <Link className={style.link} to="/repairs">Сервіс</Link>
            <Link className={style.link} to="/analytics">Статистика</Link>
            <Link className={style.link} to="admin/users">Панель адміністратора</Link>
            </> )}
            <AuthenticationDetails />
          </nav>

      </section>

      <section>
        <AppRoutes />
      </section>
      <section className={stylesFooter.section}>
            <Footer/>
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
