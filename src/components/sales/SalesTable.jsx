import dayjs from "dayjs";
import { useState } from "react";
import { db } from "../../firebase";
import { updateDoc, doc } from "firebase/firestore";
import styles from "../../styles/Table.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SalesTable = ({ data, received, handleCheckboxChange }) => {
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

        const updatedValue =
            field === "amount"
                ? parseFloat(newValue)
                : field === "items"
                ? newValue.split(",").map((item) => item.trim())
                : newValue || data.find((item) => item.id === id)[field];

        await updateDoc(saleRef, { [field]: updatedValue });

        const index = data.findIndex((item) => item.id === id);
        if (index !== -1) {
            data[index][field] = updatedValue;
        }

        const fieldName =
            field === "client"
                ? "Клієнт"
                : field === "ttn"
                ? "ТТН"
                : field === "payment"
                ? "Спосіб оплати"
                : field === "items"
                ? "Товар"
                : field === "orderNumber"
                ? "Номер замовлення"
                : field === "amount"
                ? "Сума"
                : field === "phone"
                ? "Телефон"
                : field === "address"
                ? "Адреса"
                : field.charAt(0).toUpperCase() + field.slice(1);

        toast.success(`Редагування поля "${fieldName}" прийнято !`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        setEditingCell(null);
    };

    if (!data.length) return <p>Поки що немає продажів...</p>;

    const isOldOrder = (date) => dayjs().diff(dayjs(date), "day") >= 9;

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
                    <th>Отримано</th>
                </tr>
            </thead>
            <tbody>
                {data.map((sale) => {
                    const isEditing = (field) =>
                        editingCell?.id === sale.id &&
                        editingCell?.field === field;
                    const editInput = (field, value, type = "text") =>
                        field === "payment" ? (
                            <input
                                type="text"
                                value={newValue || value}
                                onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    setNewValue(selectedValue);
                                }}
                                onBlur={handleSave}
                                onKeyDown={handleKeyDown}
                                className={styles.editInput}
                                autoFocus
                            />
                        ) : (
                            <input
                                type={type}
                                value={newValue || value}
                                onChange={handleChange}
                                onBlur={handleSave}
                                onKeyDown={handleKeyDown}
                                className={styles.editInput}
                                autoFocus
                            />
                        );

                    return (
                        <tr
                            key={sale.id}
                            style={{
                                backgroundColor: received[sale.id]
                                    ? "lightgreen"
                                    : isOldOrder(sale.date) &&
                                      !received[sale.id]
                                    ? "coral"
                                    : "transparent",
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
                                    backgroundColor: isEditing("orderNumber")
                                        ? "#d4fcd4"
                                        : "transparent",
                                    cursor: "pointer",
                                }}
                            >
                                {isEditing("orderNumber")
                                    ? editInput("orderNumber", sale.orderNumber)
                                    : sale.orderNumber}
                            </td>
                            <td>{dayjs(sale.date).format("DD.MM.YYYY")}</td>
                            <td
                                onClick={() =>
                                    handleCellClick(
                                        sale.id,
                                        "items",
                                        sale.items
                                    )
                                }
                                style={{
                                    backgroundColor: isEditing("items")
                                        ? "#d4fcd4"
                                        : "transparent",
                                    cursor: "pointer",
                                }}
                            >
                                {isEditing("items")
                                    ? editInput("items", sale.items.join(", "))
                                    : sale.items.map((item, i) => (
                                          <p key={i}>{item}</p>
                                      ))}
                            </td>
                            <td
                                onClick={() =>
                                    handleCellClick(
                                        sale.id,
                                        "client",
                                        sale.client
                                    )
                                }
                                style={{
                                    backgroundColor: isEditing("client")
                                        ? "#d4fcd4"
                                        : "transparent",
                                    cursor: "pointer",
                                }}
                            >
                                {isEditing("client")
                                    ? editInput("client", sale.client)
                                    : sale.client}
                            </td>
                            <td
                                onClick={() =>
                                    handleCellClick(
                                        sale.id,
                                        "phone",
                                        sale.phone
                                    )
                                }
                                style={{
                                    backgroundColor: isEditing("phone")
                                        ? "#d4fcd4"
                                        : "transparent",
                                    cursor: "pointer",
                                }}
                            >
                                {isEditing("phone")
                                    ? editInput("phone", sale.phone)
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
                                    backgroundColor: isEditing("address")
                                        ? "#d4fcd4"
                                        : "transparent",
                                    cursor: "pointer",
                                }}
                            >
                                {isEditing("address")
                                    ? editInput("address", sale.address)
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
                                    backgroundColor: isEditing("payment")
                                        ? "#d4fcd4"
                                        : "transparent",
                                    cursor: "pointer",
                                }}
                            >
                                {isEditing("payment")
                                    ? editInput("payment", sale.payment)
                                    : sale.payment}
                            </td>
                            <td
                                onClick={() =>
                                    handleCellClick(
                                        sale.id,
                                        "amount",
                                        sale.amount
                                    )
                                }
                                style={{
                                    backgroundColor: isEditing("amount")
                                        ? "#d4fcd4"
                                        : "transparent",
                                    cursor: "pointer",
                                }}
                            >
                                {isEditing("amount")
                                    ? editInput("amount", sale.amount, "number")
                                    : sale.amount}
                            </td>
                            <td
                                onClick={() =>
                                    handleCellClick(sale.id, "ttn", sale.ttn)
                                }
                                style={{
                                    backgroundColor: isEditing("ttn")
                                        ? "#d4fcd4"
                                        : "transparent",
                                    cursor: "pointer",
                                }}
                            >
                                {isEditing("ttn")
                                    ? editInput("ttn", sale.ttn)
                                    : sale.ttn}
                            </td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={received[sale.id] || false}
                                    onChange={() =>
                                        handleCheckboxChange(sale.id)
                                    }
                                    className={styles.checkbox}
                                />
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default SalesTable;
