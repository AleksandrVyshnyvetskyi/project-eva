import styles from "../../styles/Loader.module.css";

const Loader = () => {
    return (
        <div className={styles.card}>
            <div className={styles.loader}>
                <p>Завантаження</p>
                <div className={styles.words}>
                    <span className={styles.word}>таблиць...</span>
                    <span className={styles.word}>кнопок...</span>
                    <span className={styles.word}>кави...</span>
                    <span className={styles.word}>статистики...</span>
                    <span className={styles.word}>буковок...</span>
                </div>
            </div>
        </div>
    );
};

export default Loader;
