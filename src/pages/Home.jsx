import style from '../styles/Home.module.css'

const Home = () => {
    return <h1>Привіт, я Ева - твоя помічниця по:
        <br/><span className={style.accent}>Е</span>лектронним продажам,
        <br/><span className={style.accent}>В</span>ідправок в сервіс,
        <br/><span className={style.accent}>А</span>налітиці</h1>
}

export default Home;