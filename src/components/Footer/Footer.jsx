import styles from '../../styles/Footer.module.css'

const Footer = () => {
    return (
        <div className={styles.container}>
            <div className={styles.company}>
                <h4 className={styles.title}>Ця система спроектована<br/>спеціально для компанії:</h4>
                <a href="https://www.smsmarket.ua/">
                    <img className={styles.img} src="https://www.smsmarket.ua/image/catalog/logoSMS2021-png.webp"></img>
                </a>
            </div>
            <div className={styles.creator}>
                    <a
                        className={styles.creatorLink}
                        target="_blank"
                        href="https://aleksandrvyshnyvetskyi.github.io/My_resume_2.0/"
                        >created by <span>Alexander V</span>.</a
                    >
                    <a
                        className={styles.creatorLink}
                        target="_blank"
                        href="https://t.me/Aleksander9626"
                        >Telegram</a
                    >
            </div>
        </div>
    )
}

export default Footer