import { Link } from 'react-router-dom';
import { AuthProvider } from "./contex/AuthContext";
import AppRoutes from './routes';
import style from './styles/Header.module.css';
import AuthenticationDetails from './components/authentication/AuthenticationDetails';
import { useAuth } from "./contex/AuthContext"; // ⬅️ добавляем

function AppContent() {
  const { role } = useAuth(); // ⬅️ получаем роль

  const allowedRoles = ["admin", "creater"];
  const canViewNav = allowedRoles.includes(role); // ⬅️ проверка

  return (
    <>
      <section className={style.container}>
        <h2 className={style.title}>ЕВА</h2>

        {canViewNav && (
          <nav>
            <Link className={style.link} to="/">Головна</Link>
            <Link className={style.link} to="/sales">Продажі</Link>
            <Link className={style.link} to="/repairs">Сервіс</Link>
            <Link className={style.link} to="/analytics">Статистика</Link>
          </nav>
        )}

        <AuthenticationDetails />
      </section>

      <section>
        <AppRoutes />
      </section>
    </>
  );
}

// Оборачиваем AppContent в AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
