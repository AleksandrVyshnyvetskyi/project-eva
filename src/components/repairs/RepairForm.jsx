import { useState, useEffect } from "react";
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
        cause: "",
        service: "",
        isReturned: false,
    });

    const brandToServiceMap = {
        Xiaomi: "Майстерня №1",
        Oppo: "Майстерня №1",
        Apple: "Fyoocha",
        Doogee: "Гратіс",
        Samsung: "Samsung",
        Motorola: "ТОВ mti-Сервис",
        Oscal: "Elffix Сервіс",
        Realme: "ТОВ РитейлКомпані",
        Sigma: "ТОВ Дейна",
        Ergo: "Сервіс сучасної електроніки",
        Nomi: "Цифротех",
      };

      useEffect(() => {
        setFormData((prev) => ({
          ...prev,
          service: brandToServiceMap[formData.brand] || "",
        }));
      }, [formData.brand]);

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
            dateReceived: dayjs(formData.dateReceived).toDate(),
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
                        { value: "Xiaomi", label: "Xiaomi" },
                        { value: "Oppo", label: "Oppo" },
                        { value: "Apple", label: "Apple" },
                        { value: "Doogee", label: "Doogee" },
                        { value: "Samsung", label: "Samsung" },
                        { value: "Motorola", label: "Motorola" },
                        { value: "Oscal", label: "Oscal" },
                        { value: "Realme", label: "Realme" },
                        { value: "Sigma", label: "Sigma" },
                        { value: "Ergo", label: "Ergo" },
                        { value: "Nomi", label: "Nomi" },
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
                    inputMode="numeric"
                    pattern="[0-9]{15}"
                    maxLength={15}
                    onChange={handleChange}
                    required
                />

<Field
                    name="cause"
                    placeholder="Недолік"
                    type="text"
                    value={formData.cause}
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
                        ...Array.from({ length: 14 }, (_, i) => ({
                            value: `SmS ${i + 1}`,
                            label: `SmS ${i + 1}`,
                        })),
                    ]}
                />

                <Field
                    type="select"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    options={[
                        { value: "", label: "Оберіть Сервіс", disabled: true },
                        { value: "Майстерня №1", label: "Майстерня №1"},
                        { value: "Fyoocha", label: "Fyoocha"},
                        { value: "Гратіс", label: "Гратіс"},
                        { value: "Samsung", label: "Samsung Сервіс"},
                        { value: "ТОВ mti-Сервис", label: "ТОВ mti-Сервис"},
                        { value: "Elffix Сервіс", label: "Elffix Сервіс"},
                        { value: "ТОВ РитейлКомпані", label: "ТОВ РитейлКомпані"},
                        { value: "ТОВ Дейна", label: "ТОВ Дейна"},
                        { value: "Сервіс сучасної електроніки", label: "Сервіс сучасної електроніки"},
                        { value: "Цифротех", label: "Цифротех"},
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
