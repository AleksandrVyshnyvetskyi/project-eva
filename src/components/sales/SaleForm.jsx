import { useState } from "react";
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { uk } from 'date-fns/locale';
import dayjs from "dayjs";
import styles from '../../styles/Sales.module.css'

registerLocale('uk', uk);

const SaleForm = ({ onAdd }) => {  
    const [form, setForm] = useState({
        orderNumber: '',
        items: [''],
        date: dayjs().format('YYYY-MM-DD'),
        client: '',
        address: '',
        payment: '',
        phone: '',
        amount: '',
        ttn: ''
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
        setForm((prev) => ({ ...prev, items: [...prev.items, ''] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.items.some(item => item.trim()) || !form.client || !form.amount || !form.ttn) {
            alert("Будь ласка, заповніть усі обов'язкові поля!");
            return;
        }

        onAdd({
            ...form,
            items: form.items.filter(item => item.trim())
        });

        setForm({
            orderNumber: '',
            items: [''],
            date: dayjs().format('YYYY-MM-DD'),
            client: '',
            address: '',
            payment: '',
            phone: '',
            amount: '',
            ttn: ''
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
                required
            />
            <div className={styles.wrapper}>
                {form.items.map((item, index) => (
                    <input key={index}
                        className={styles.input}
                        name="item"
                        placeholder="Товар на відправку"
                        value={item}
                        onChange={(e) => handleChange(e, index)}
                        required
                    />
                ))}
                <button type="button" className={styles.btn} onClick={handleAddItem}>Додати товар</button>
            </div>

            {/* <DatePicker
                selected={new Date(form.date)}
                onChange={(date) => {
                    const formattedDate = dayjs(date).format('DD.MM.YYYY');
                    setForm((prev) => ({ ...prev, date: formattedDate }));
                }}
                locale="uk"
                dateFormat="DD.MM.YYYY"
                className={styles.input}
                value={form.date}
                required
            /> */}
            
            <input
                className={styles.input}
                lang="uk"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
            />

            <input
                className={styles.input}
                name="client"
                placeholder="Ім'я клієнта"
                value={form.client}
                onChange={handleChange}
                required
            />
            <input
                className={styles.input}
                name="phone"
                placeholder="Номер телефону"
                value={form.phone}
                onChange={handleChange}
                required
            />
            <input
                className={styles.input}
                name="address"
                placeholder="Адреса"
                value={form.address}
                onChange={handleChange}
                required
            />
            <input
                className={styles.input}
                name="amount"
                type="number"
                placeholder="Сума замовлення"
                value={form.amount}
                onChange={handleChange}
                required
            />
            <input
                className={styles.input}
                name="ttn"
                placeholder="ТТН"
                value={form.ttn}
                onChange={handleChange}
                required
            />
            <select
                className={styles.input}
                name="payment"
                value={form.payment}
                onChange={handleChange}
                required
            >
                <option value="" disabled>Оберіть спосіб оплати</option>
                <option>Післяплата</option>
                <option>Готівка</option>
                <option>Карта</option>
                <option>Р/Р</option>
                <option>О/Ч Приват Банк</option>
                <option>О/Ч Моно</option>
                <option>О/Ч ПУМБ</option>
                <option>О/Ч Sens</option>
            </select>

            <button type="submit" className={styles.button}>Додати</button>
        </form>
    );
};

export default SaleForm;
