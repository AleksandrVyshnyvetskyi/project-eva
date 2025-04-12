import { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import dayjs from "dayjs";
import styles from '../../styles/Repairs.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RepairForm = ({ onAddRepair }) => {
    const [formData, setFormData] = useState({
        dateReceived: dayjs().format('YYYY-MM-DD'),
        brand: '',
        model: '',
        imei: '',
        store: '',
        service: '',
        isReturned: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newRepairOrder = {
            ...formData,
            repairStatusDate: dayjs(formData.dateReceived).toDate(),
        };

        try {
            toast.info("Нове замовлення на ремонт створюється...");
            const docRef = await addDoc(collection(db, "repair_orders"), newRepairOrder);
            const createdOrderWithId = { ...newRepairOrder, id: docRef.id };
            toast.success("Замовлення на ремонт успішно додано!");
            onAddRepair?.(createdOrderWithId);

            setFormData({
                dateReceived: dayjs().format('YYYY-MM-DD'),
                brand: '',
                model: '',
                imei: '',
                store: '',
                service: '',
                isReturned: false,
            });
        } catch (error) {
            console.error("Помилка при додаванні замовлення:", error);
            toast.error("Помилка при додаванні замовлення!");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input type="date" name="dateReceived" className={styles.input} value={formData.dateReceived} onChange={handleChange} />
                
                <select name="brand" className={styles.input} value={formData.brand} onChange={handleChange} required>
                    <option value="" disabled>Бренд</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Xiaomi">Xiaomi</option>
                    <option value="Oscal">Oscal</option>
                    <option value="Motorola">Motorola</option>
                    <option value="Realme">Realme</option>
                    <option value="Nomi">Nomi</option>
                    <option value="Sigma">Sigma</option>
                    <option value="Ergo">Ergo</option>
                </select>

                <input name="model" placeholder="Модель" className={styles.input} type="text" value={formData.model} onChange={handleChange} required />
                <input name="imei" placeholder="IMEI" className={styles.input} type="text" value={formData.imei} onChange={handleChange} required />

                <select name="store" className={styles.input} value={formData.store} onChange={handleChange} required>
                    <option value="" disabled>Оберіть Магазин</option>
                    {Array.from({ length: 13 }, (_, i) => (
                        <option key={i + 1} value={`SmS ${i + 1}`}>SmS {i + 1}</option>
                    ))}
                </select>

                <select name="service" className={styles.input} value={formData.service} onChange={handleChange} required>
                    <option value="" disabled>Оберіть Сервіс</option>
                    <option value="service1">Сервіс 1</option>
                    <option value="service2">Сервіс 2</option>
                </select>

                <button className={styles.button} type="submit">Додати відправку</button>
            </form>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
};

export default RepairForm;
