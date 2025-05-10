import { useState } from "react";
import { registerLocale } from "react-datepicker";
import { toast } from "react-toastify";
import { uk } from "date-fns/locale";
import dayjs from "dayjs";
import Button from "../common/Button";
import Field from "../common/Field";
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
        additionalSales: "",
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

    const handleRemoveItem = (indexToRemove) => {
        setForm((prev) => ({
            ...prev,
            items: prev.items.filter((_, index) => index !== indexToRemove),
        }));
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
            !form.amount
        ) {
            toast.error("Будь ласка, заповніть усі обов'язкові поля!");
            return;
        }

        onAdd({
            ...form,
            items: form.items.filter((item) => item.trim()),
            
        });

        toast.success(
            `Замовлення прийнято 😎`,
            {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            }
        );

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
            <Field
                className="saleField"
                type="text"
                name="orderNumber"
                placeholder="Номер замовлення"
                value={form.orderNumber}
                onChange={handleChange}
            />
            <div className={styles.wrapper}>
            {form.items.map((item, index) => (
                <div key={index} className={styles.itemWithRemove}>
                    <Field
                        className="saleField"
                        type="text"
                        name="item"
                        placeholder="Товар на відправку"
                        value={item}
                        onChange={(e) => handleChange(e, index)}
                    />
                    {index !== 0 && (
                        <Button
                            variant="removeButton"
                            onClick={() => handleRemoveItem(index)}
                            type="button"
                        >
                            ❌
                        </Button>
                    )}
                </div>
            ))}
                <Button
                    variant="buttonAdd"
                    onClick={handleAddItem}
                    type="button"
                >
                    Додати товар
                </Button>
            </div>
            <Field
                className="saleField"
                lang="uk"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
            />
            <Field
                className="saleField"
                name="client"
                placeholder="Ім'я клієнта"
                value={form.client}
                onChange={handleChange}
            />
            <Field
                className="saleField"
                name="phone"
                placeholder="Номер телефону"
                value={form.phone}
                onChange={handleChange}
            />
            <Field
                className="saleField"
                name="address"
                placeholder="Адреса"
                value={form.address}
                onChange={handleChange}
            />
            <Field
                className="saleField"
                name="amount"
                type="number"
                placeholder="Сума замовлення"
                value={form.amount}
                onChange={handleChange}
            />
            <Field
                className="saleField"
                name="ttn"
                placeholder="ТТН"
                value={form.ttn}
                onChange={handleChange}
            />
            <Field
                className="saleField"
                type="select"
                name="payment"
                value={form.payment}
                onChange={handleChange}
                options={[
                    { value: "", label: "Спосіб оплати", disabled: true },
                    { value: "Післяплата", label: "Післяплата" },
                    { value: "Готівка", label: "Готівка" },
                    { value: "Карта", label: "Карта" },
                    { value: "Р/Р", label: "Р/Р" },
                    { value: "Плати пiзнiше", label: "Плати пiзнiше" },
                    { value: "О/Ч Приват Банк", label: "О/Ч Приват Банк" },
                    { value: "О/Ч Моно", label: "О/Ч Моно" },
                    { value: "О/Ч ПУМБ", label: "О/Ч ПУМБ" },
                    { value: "О/Ч Sens", label: "О/Ч Sens" },
                ]}
            />
            <Field
                className="saleField"
                name="additionalSales"
                placeholder="Додаткові продажі"
                value={form.additionalSales}
                onChange={handleChange}
            />
            <Button variant="buttonSubmit" type="submit">
                Додати
            </Button>
        </form>
    );
};

export default SaleForm;
