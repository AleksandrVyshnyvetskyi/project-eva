import axios from "axios";
import dayjs from "dayjs";

const BOT_TOKEN = "7811936235:AAHvcYPIFE7K_V6y6aQ-AcTsNlmrXbZMc_0";
const CHAT_ID = "772557039";
const URL_API = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

export const sendTelegramMessage = (sale) => {
    const messageToBot = `
Замовлення <b>№${sale.orderNumber}</b> одержано!
Дата замовлення: <b>${dayjs(sale.date).format("DD.MM.YYYY")}</b>
Ім'я: <b>${sale.client}</b>
Телефон: <b>${sale.phone}</b>
Адреса: <b>${sale.address}</b>
Товар: <b>${sale.items.join(", ")}</b>
Спосіб оплати: <b>${sale.payment}</b>
Сума: <b>${sale.amount} грн</b>
`;

    axios
        .post(URL_API, {
            chat_id: CHAT_ID,
            parse_mode: "html",
            text: messageToBot,
        })
        .catch((error) => {
            console.error("❌ Помилка при надсиланні в Telegram:", error);
        });
};