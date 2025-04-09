import { Link } from 'react-router-dom';
import AppRoutes from './routes';
import style from './styles/Header.module.css'

function App() {
  return (
    <>
    <section className={style.container}>
      <h2 className={style.title}>ЕВА</h2>
      <nav>
        <Link className={style.link} to="/">Головна</Link>
        <Link className={style.link} to="/sales">Продажі</Link>
        <Link className={style.link} to="/repairs">Сервіс</Link>
        <Link className={style.link} to="/analytics">Статистика</Link>
      </nav>
    </section>
    <section>
      <AppRoutes />
    </section>
    </>
  );
}

export default App;
