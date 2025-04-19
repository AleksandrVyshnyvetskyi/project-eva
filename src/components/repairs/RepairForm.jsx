import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../common/Button";
import Field from "../common/Field";
import styles from "../../styles/Repairs.module.css";

const RepairForm = ({ onAddRepair }) => {
    const [formData, setFormData] = useState({
        dateReceived: dayjs().format("YYYY-MM-DD"),
        brand: "",
        model: "",
        imei: "",
        store: "",
        service: "",
        isReturned: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
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
            const docRef = await addDoc(
                collection(db, "repair_orders"),
                newRepairOrder
            );
            const createdOrderWithId = { ...newRepairOrder, id: docRef.id };
            toast.success("Замовлення на ремонт успішно додано!");
            onAddRepair?.(createdOrderWithId);

            setFormData({
                dateReceived: dayjs().format("YYYY-MM-DD"),
                brand: "",
                model: "",
                imei: "",
                store: "",
                service: "",
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
                <Field
                    type="date"
                    name="dateReceived"
                    value={formData.dateReceived}
                    onChange={handleChange}
                />

                <Field
                    type="select"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                    options={[
                        { value: "", label: "Бренд", disabled: true },
                        { value: "Samsung", label: "Samsung" },
                        { value: "Xiaomi", label: "Xiaomi" },
                        { value: "Oscal", label: "Oscal" },
                        { value: "Motorola", label: "Motorola" },
                        { value: "Realme", label: "Realme" },
                        { value: "Nomi", label: "Nomi" },
                        { value: "Sigma", label: "Sigma" },
                        { value: "Ergo", label: "Ergo" },
                    ]}
                />

                <Field
                    name="model"
                    placeholder="Модель"
                    type="text"
                    value={formData.model}
                    onChange={handleChange}
                    required
                />

                <Field
                    name="imei"
                    placeholder="IMEI"
                    type="text"
                    value={formData.imei}
                    onChange={handleChange}
                    required
                />

                <Field
                    type="select"
                    name="store"
                    value={formData.store}
                    onChange={handleChange}
                    required
                    options={[
                        { value: "", label: "Оберіть Магазин", disabled: true },
                        ...Array.from({ length: 13 }, (_, i) => ({
                            value: `SmS ${i + 1}`,
                            label: `SmS ${i + 1}`,
                        })),
                    ]}
                />

                <Field
                    type="select"
                    name="serviceInfo"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    options={[
                        { value: "", label: "Оберіть Сервіс", disabled: true },
                        { value: "ТОВ Дейна", label: "ТОВ Дейна (Sigma)" },
                        {
                            value: "ТОВ MTI Сервіс",
                            label: "ТОВ MTI Сервіс (Motorola)",
                        },
                        {
                            value: "Майстерня №1",
                            label: "Майстерня №1 (Nomi/Realme/Xiaomi)",
                        },
                        { value: "Elffix", label: "Elffix (Oscal)" },
                        { value: "FyooCha", label: "FyooCha (Samsung)" },
                        { value: "СВП Плюс", label: "СВП Плюс (Nokia)" },
                        {
                            value: "Цитрус Сервіс/ТОВ'Рітейл Компані'",
                            label: 'Цитрус Сервіс/ТОВ"Рітейл Компані" (Nomi)',
                        },
                        { value: "Юг", label: "Юг (Ergo)" },
                    ]}
                />

                <Button variant="buttonSubmit" type="submit">
                    Додати відправку
                </Button>
            </form>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
};

export default RepairForm;
