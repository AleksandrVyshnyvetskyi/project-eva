import dayjs from "dayjs";
import { useState } from "react";
import { db } from "../../firebase/firebase";
import { updateDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../../styles/Table.module.css";
import Field from "../common/Field";
import { sendTelegramMessage } from "../../utils/telegram";

const SalesTable = ({ data }) => {
    const [editingCell, setEditingCell] = useState(null);
    const [newValue, setNewValue] = useState("");

    const handleCellClick = (id, field, currentValue) => {
        const valueToEdit = Array.isArray(currentValue)
            ? currentValue.join(", ")
            : currentValue;
        setEditingCell({ id, field });
        setNewValue(valueToEdit);
    };

    const handleChange = (e) => setNewValue(e.target.value);

    const handleKeyDown = async (e) => {
        if (e.key === "Enter") {
            await handleSave();
        }
    };

    const handleSave = async () => {
        if (!editingCell) return;

        const { id, field } = editingCell;
        const saleRef = doc(db, "sales", id);
        const oldValue = data.find((item) => item.id === id)?.[field];

        let updatedValue =
            field === "amount"
                ? parseFloat(newValue)
                : field === "items"
                ? newValue.split(",").map((item) => item.trim())
                : newValue.trim();

        if (updatedValue === oldValue || updatedValue === "") {
            setEditingCell(null);
            return;
        }

        try {
            await updateDoc(saleRef, { [field]: updatedValue });
            const index = data.findIndex((item) => item.id === id);
            if (index !== -1) {
                data[index][field] = updatedValue;
            }

            const fieldNames = {
                client: "Клієнт",
                ttn: "ТТН",
                payment: "Спосіб оплати",
                items: "Товар",
                orderNumber: "Номер замовлення",
                amount: "Сума",
                phone: "Телефон",
                address: "Адреса",
            };

            const fieldName = fieldNames[field] || field;

            toast.success(`Редагування поля "${fieldName}" прийнято !`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            console.error("Помилка при збереженні:", error);
            toast.error("Не вдалося зберегти зміни");
        }

        setEditingCell(null);
    };

    if (!data.length) return <p>Поки що немає продажів...</p>;

    const isOldOrder = (date) => dayjs().diff(dayjs(date), "day") >= 9;

    const getRowColor = (status, date) => {
        switch (status) {
            case "Отримано":
                return "lightgreen";
            case "Відмова":
                return "#fbb";
            case "Відправлено":
                return "#eeee90";
            default:
                return isOldOrder(date) ? "coral" : "transparent";
        }
    };

    const isEditing = (id, field) =>
        editingCell?.id === id && editingCell?.field === field;

    const editInput = (type = "text") => (
        <Field
            type={type}
            value={newValue}
            onChange={handleChange}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="editInput"
            autoFocus
        />
    );

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>№</th>
                    <th>Дата</th>
                    <th>Товар</th>
                    <th>Ім'я клієнта</th>
                    <th>Телефон</th>
                    <th>Адреса</th>
                    <th>Форма оплати</th>
                    <th>Сума</th>
                    <th>ТТН</th>
                    <th>Статус</th>
                </tr>
            </thead>
            <tbody>
                {data.map((sale) => (
                    <tr
                        key={sale.id}
                        style={{
                            backgroundColor: getRowColor(
                                sale.status,
                                sale.date
                            ),
                        }}
                    >
                        <td
                            onClick={() =>
                                handleCellClick(
                                    sale.id,
                                    "orderNumber",
                                    sale.orderNumber
                                )
                            }
                            style={{
                                backgroundColor: isEditing(
                                    sale.id,
                                    "orderNumber"
                                )
                                    ? "#d4fcd4"
                                    : "transparent",
                                cursor: "pointer",
                            }}
                        >
                            {isEditing(sale.id, "orderNumber")
                                ? editInput()
                                : sale.orderNumber}
                        </td>
                        <td>{dayjs(sale.date).format("DD.MM.YYYY")}</td>
                        <td
                            onClick={() =>
                                handleCellClick(sale.id, "items", sale.items)
                            }
                            style={{
                                backgroundColor: isEditing(sale.id, "items")
                                    ? "#d4fcd4"
                                    : "transparent",
                                cursor: "pointer",
                            }}
                        >
                            {isEditing(sale.id, "items")
                                ? editInput()
                                : sale.items.map((item, i) => (
                                      <p key={i}>{item}</p>
                                  ))}
                        </td>
                        <td
                            onClick={() =>
                                handleCellClick(sale.id, "client", sale.client)
                            }
                            style={{
                                backgroundColor: isEditing(sale.id, "client")
                                    ? "#d4fcd4"
                                    : "transparent",
                                cursor: "pointer",
                            }}
                        >
                            {isEditing(sale.id, "client")
                                ? editInput()
                                : sale.client}
                        </td>
                        <td
                            onClick={() =>
                                handleCellClick(sale.id, "phone", sale.phone)
                            }
                            style={{
                                backgroundColor: isEditing(sale.id, "phone")
                                    ? "#d4fcd4"
                                    : "transparent",
                                cursor: "pointer",
                            }}
                        >
                            {isEditing(sale.id, "phone")
                                ? editInput()
                                : sale.phone}
                        </td>
                        <td
                            onClick={() =>
                                handleCellClick(
                                    sale.id,
                                    "address",
                                    sale.address
                                )
                            }
                            style={{
                                backgroundColor: isEditing(sale.id, "address")
                                    ? "#d4fcd4"
                                    : "transparent",
                                cursor: "pointer",
                            }}
                        >
                            {isEditing(sale.id, "address")
                                ? editInput()
                                : sale.address}
                        </td>
                        <td
                            onClick={() =>
                                handleCellClick(
                                    sale.id,
                                    "payment",
                                    sale.payment
                                )
                            }
                            style={{
                                backgroundColor: isEditing(sale.id, "payment")
                                    ? "#d4fcd4"
                                    : "transparent",
                                cursor: "pointer",
                            }}
                        >
                            {isEditing(sale.id, "payment")
                                ? editInput()
                                : sale.payment}
                        </td>
                        <td
                            onClick={() =>
                                handleCellClick(sale.id, "amount", sale.amount)
                            }
                            style={{
                                backgroundColor: isEditing(sale.id, "amount")
                                    ? "#d4fcd4"
                                    : "transparent",
                                cursor: "pointer",
                            }}
                        >
                            {isEditing(sale.id, "amount")
                                ? editInput("number")
                                : sale.amount}
                        </td>
                        <td
                            onClick={() =>
                                handleCellClick(sale.id, "ttn", sale.ttn)
                            }
                            style={{
                                backgroundColor: isEditing(sale.id, "ttn")
                                    ? "#d4fcd4"
                                    : "transparent",
                                cursor: "pointer",
                            }}
                        >
                            {isEditing(sale.id, "ttn") ? editInput() : sale.ttn}
                        </td>
                        <td>
                            <Field
                                type="select"
                                name="status"
                                value={sale.status || "Не відправлено"}
                                onChange={async (e) => {
                                    const newStatus = e.target.value;
                                    const saleRef = doc(db, "sales", sale.id);
                                    await updateDoc(saleRef, {
                                        status: newStatus,
                                    });
                                    sale.status = newStatus;

                                    if (newStatus === "Отримано") {
                                        sendTelegramMessage(sale);
                                    }

                                    toast.success(
                                        `Статус змінено на "${newStatus}"`,
                                        {
                                            position: "top-right",
                                            autoClose: 3000,
                                            hideProgressBar: true,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true,
                                        }
                                    );
                                }}
                                className="statusSelect"
                                options={[
                                    {
                                        value: "Не відправлено",
                                        label: "Не відправлено",
                                    },
                                    {
                                        value: "Відправлено",
                                        label: "Відправлено",
                                    },
                                    { value: "Отримано", label: "Отримано" },
                                    { value: "Відмова", label: "Відмова" },
                                ]}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default SalesTable;
