import dayjs from "dayjs";
import { useState } from "react";
import { useEffect, useRef } from "react";
import { db } from "../../firebase/firebase";
import { updateDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../../styles/Table.module.css";
import Field from "../common/Field";
import { sendTelegramMessage } from "../../utils/telegram";

const SalesTable = ({ data,highlightId }) => {
    const [editingCell, setEditingCell] = useState(null);
    const [newValue, setNewValue] = useState("");
    const rowRefs = useRef({});
    const [sortConfig, setSortConfig] = useState({
        key: "date",
        direction: "desc",
    });

    useEffect(() => {
        if (highlightId && rowRefs.current[highlightId]) {
          rowRefs.current[highlightId].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, [highlightId]);

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
                additionalSales: "Додаткові продажі",
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

    const handleSort = (key) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                return {
                    key,
                    direction: prev.direction === "asc" ? "desc" : "asc",
                };
            }
            return { key, direction: "asc" };
        });
    };

    const sortedData = [...data].sort((a, b) => {
        const { key, direction } = sortConfig;
    
        let valueA = a[key];
        let valueB = b[key];
    
        // null / undefined защита
        if (valueA == null) valueA = "";
        if (valueB == null) valueB = "";
    
        // дата
        if (key === "date") {
            valueA = dayjs(valueA);
            valueB = dayjs(valueB);
        }
    
        // массивы (items)
        else if (Array.isArray(valueA)) {
            valueA = valueA.join(", ").toLowerCase();
            valueB = valueB.join(", ").toLowerCase();
        }
    
        // числа
        else if (typeof valueA === "number") {
            valueA = Number(valueA);
            valueB = Number(valueB);
        }
    
        // всё остальное → строка
        else {
            valueA = String(valueA).toLowerCase();
            valueB = String(valueB).toLowerCase();
        }
    
        if (valueA < valueB) return direction === "asc" ? -1 : 1;
        if (valueA > valueB) return direction === "asc" ? 1 : -1;
        return 0;
    });

    const SortArrow = ({ column }) =>
    sortConfig.key === column
        ? sortConfig.direction === "asc"
            ? " ↑"
            : " ↓"
        : "";

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
                <th onClick={() => handleSort("orderNumber")}>№ <SortArrow column="orderNumber" /></th>
        <th onClick={() => handleSort("date")}>
            Дата <SortArrow column="date" />
        </th>
        <th onClick={() => handleSort("items")}>
            Товар <SortArrow column="items" />
        </th>
        <th onClick={() => handleSort("additionalSales")}>
            Додаткові продажі <SortArrow column="additionalSales" />
        </th>
        <th onClick={() => handleSort("client")}>
            Ім'я клієнта <SortArrow column="client" />
        </th>
        <th onClick={() => handleSort("phone")}>
            Телефон <SortArrow column="phone" />
        </th>
        <th onClick={() => handleSort("address")}>
            Адреса <SortArrow column="address" />
        </th>
        <th onClick={() => handleSort("payment")}>
            Форма оплати <SortArrow column="payment" />
        </th>
        <th onClick={() => handleSort("amount")}>
            Сума <SortArrow column="amount" />
        </th>
        <th onClick={() => handleSort("ttn")}>
            ТТН <SortArrow column="ttn" />
        </th>
        <th onClick={() => handleSort("status")}>
            Статус <SortArrow column="status" />
        </th>
                </tr>
            </thead>
            <tbody>
            {sortedData.map((sale) => (
                    <tr
                    key={sale.id}
                    ref={(el) => (rowRefs.current[sale.id] = el)}
                    className={
                      sale.id === highlightId ? styles.highlightRow : ""
                    }
                    style={{
                      backgroundColor: getRowColor(sale.status, sale.date),
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
                                handleCellClick(sale.id, "additionalSales", sale.additionalSales)
                            }
                            style={{
                                backgroundColor: isEditing(sale.id, "additionalSales")
                                    ? "#d4fcd4"
                                    : "transparent",
                                cursor: "pointer",
                            }}
                        >
                            {isEditing(sale.id, "additionalSales")
                                ? editInput()
                                : sale.additionalSales}
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
