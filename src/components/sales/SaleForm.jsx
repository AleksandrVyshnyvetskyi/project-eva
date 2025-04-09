import { useState } from "react";
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";
import styles from '../../styles/Sales.module.css'

const SaleForm = ({ onAdd }) => {  // Передаем функцию onAdd через пропсы
    const [form, setForm] = useState({
        items: [''], // Начальный массив с одним полем для item
        date: dayjs().format('YYYY-MM-DD'),
        client: '',
        address: '',
        payment: ''
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
        setForm((prev) => ({ ...prev, items: [...prev.items, ''] })); // Добавляем новый элемент в массив
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Проверка, что обязательные поля заполнены
        if (!form.items.some(item => item.trim()) || !form.client) {
            alert("Будь ласка, заповніть усі обов'язкові поля!");
            return;
        }

        // Добавляем объект с уникальным id
        onAdd({
            ...form,
            id: uuid(),
            items: form.items.filter(item => item.trim()) // Убираем пустые элементы
        });

        // Сброс формы после отправки
        setForm({
            items: [''],
            date: dayjs().format('YYYY-MM-DD'),
            client: '',
            address: '',
            payment: ''
        });
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.wrapper}>{form.items.map((item, index) => (
                <input key={index}
                    className={styles.input}
                    name="item"
                    placeholder="Товар на відправку"
                    value={item}
                    onChange={(e) => handleChange(e, index)}
                    required
                />
                ))}
                <button type="button" onClick={handleAddItem}>Додати товар</button>
            </div>
            
            <input
                className={styles.input}
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
                name="address"
                placeholder="Адреса"
                value={form.address}
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
                <option selected="selected" disabled="disabled">Оберіть спосіб оплати</option>
                <option>Готівка</option>
                <option>Карта</option>
                <option>Р/Р</option>
                <option>Оплата частинами ПП</option>
                <option>Оплата частинами МБ</option>
                <option>Оплата частинами ПУМБ</option>
                <option>Плати пізніше</option>
            </select>
            <button className={styles.button} type="submit">Додати</button>
        </form>
    );
};

export default SaleForm;
