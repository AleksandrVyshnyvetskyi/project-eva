import { useState } from "react";
import { registerLocale } from "react-datepicker";
import { toast } from "react-toastify";
import { uk } from "date-fns/locale";
import dayjs from "dayjs";
import Button from "../common/Button";
import styles from "../../styles/Sales.module.css";

registerLocale("uk", uk);

const SaleForm = ({ onAdd }) => {
    const [form, setForm] = useState({
        orderNumber: "",
        items: [""],
        date: dayjs().format("YYYY-MM-DD"),
        client: "",
        address: "",
        payment: "",
        phone: "",
        amount: "",
        ttn: "",
    });

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        if (name === "item") {
            const newItems = [...form.items];
            newItems[index] = value;
            setForm((prev) => ({ ...prev, items: newItems }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleAddItem = () => {
        setForm((prev) => ({ ...prev, items: [...prev.items, ""] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !form.items.some((item) => item.trim()) ||
            !form.orderNumber ||
            !form.items ||
            !form.date ||
            !form.address ||
            !form.payment ||
            !form.phone ||
            !form.client ||
            !form.amount ||
            !form.ttn
        ) {
            toast.error("Будь ласка, заповніть усі обов'язкові поля!");
            return;
        }

        onAdd({
            ...form,
            items: form.items.filter((item) => item.trim()),
        });

        setForm({
            orderNumber: "",
            items: [""],
            date: dayjs().format("YYYY-MM-DD"),
            client: "",
            address: "",
            payment: "",
            phone: "",
            amount: "",
            ttn: "",
        });
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <input
                className={styles.input}
                name="orderNumber"
                placeholder="Номер замовлення"
                value={form.orderNumber}
                onChange={handleChange}
            />
            <div className={styles.wrapper}>
                {form.items.map((item, index) => (
                    <input
                        key={index}
                        className={styles.input}
                        name="item"
                        placeholder="Товар на відправку"
                        value={item}
                        onChange={(e) => handleChange(e, index)}
                    />
                ))}
                <Button variant="buttonAdd" onClick={handleAddItem} type="submit">Додати товар</Button>
            </div>
            <input
                className={styles.input}
                lang="uk"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
            />

            <input
                className={styles.input}
                name="client"
                placeholder="Ім'я клієнта"
                value={form.client}
                onChange={handleChange}
            />
            <input
                className={styles.input}
                name="phone"
                placeholder="Номер телефону"
                value={form.phone}
                onChange={handleChange}
            />
            <input
                className={styles.input}
                name="address"
                placeholder="Адреса"
                value={form.address}
                onChange={handleChange}
            />
            <input
                className={styles.input}
                name="amount"
                type="number"
                placeholder="Сума замовлення"
                value={form.amount}
                onChange={handleChange}
            />
            <input
                className={styles.input}
                name="ttn"
                placeholder="ТТН"
                value={form.ttn}
                onChange={handleChange}
            />
            <select
                className={styles.input}
                name="payment"
                value={form.payment}
                onChange={handleChange}
            >
                <option value="" disabled>
                    Оберіть спосіб оплати
                </option>
                <option>Післяплата</option>
                <option>Готівка</option>
                <option>Карта</option>
                <option>Р/Р</option>
                <option>Плати пiзнiше</option>
                <option>О/Ч Приват Банк</option>
                <option>О/Ч Моно</option>
                <option>О/Ч ПУМБ</option>
                <option>О/Ч Sens</option>
            </select>

            <Button variant="buttonSubmit" type="submit">Додати</Button>
        </form>
    );
};

export default SaleForm;
