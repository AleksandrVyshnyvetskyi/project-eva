import { useState, useEffect, useRef } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import Field from "../common/Field";
import styles from "../../styles/Repairs.module.css";
import Loader from "../loader/Loader";

const RepairOrdersTable = ({ highlightId })  => {
    const [repairOrders, setRepairOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({
        key: "dateReceived",
        direction: "desc",
    });
    const rowRefs = useRef({});

    useEffect(() => {
        const fetchRepairOrders = async () => {
            try {
                const querySnapshot = await getDocs(
                    collection(db, "repair_orders")
                );
                const ordersData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setRepairOrders(ordersData);
            } catch (error) {
                toast.error("Помилка при завантаженні даних");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRepairOrders();
    }, []);

    const handleMarkAsReturned = async (orderId) => {
        try {
            const order = repairOrders.find((o) => o.id === orderId);
            const newValue = !order.isReturned;

            await updateDoc(doc(db, "repair_orders", orderId), {
                isReturned: newValue,
            });

            setRepairOrders((prevOrders) =>
                prevOrders.map((o) =>
                    o.id === orderId ? { ...o, isReturned: newValue } : o
                )
            );

            if (newValue) {
                toast.success("✅ Видано клієнту!");
            }
        } catch (error) {
            console.error("Помилка при оновленні:", error);
            toast.error("Помилка при оновленні статусу");
        }
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

    const sortedOrders = [...repairOrders].sort((a, b) => {
        const { key, direction } = sortConfig;
    
        let valueA = a[key];
        let valueB = b[key];
    
        // даты
        if (key === "dateReceived") {
            valueA = dayjs(valueA?.toDate?.() || valueA);
            valueB = dayjs(valueB?.toDate?.() || valueB);
        }
    
        if (key === "store") {
            const getNumber = (str) => {
                const match = str.match(/\d+$/);
                return match ? parseInt(match[0], 10) : 0;
            };
            valueA = getNumber(valueA);
            valueB = getNumber(valueB);
        }
    
        if (typeof valueA === "string") {
            valueA = valueA.toLowerCase();
            valueB = valueB.toLowerCase();
        }
    
        if (typeof valueA === "boolean") {
            valueA = valueA ? 1 : 0;
            valueB = valueB ? 1 : 0;
        }
    
        if (valueA < valueB) return direction === "asc" ? -1 : 1;
        if (valueA > valueB) return direction === "asc" ? 1 : -1;
        return 0;
    });

    useEffect(() => {
        if (highlightId && rowRefs.current[highlightId]) {
          rowRefs.current[highlightId].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, [highlightId, sortedOrders.length]);

    const SortArrow = ({ column }) =>
    sortConfig.key === column
        ? sortConfig.direction === "asc"
            ? " ↑"
            : " ↓"
        : "";

    if (isLoading) {
        return <Loader />;
    }

    if (repairOrders.length === 0) {
        return <p>Поки що немає сервісних відправок...</p>;
    }

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.repairOrdersTables}>
                <thead>
                    <tr>
                    <th onClick={() => handleSort("dateReceived")}>
                        Дата приймання <SortArrow column="dateReceived" />
                    </th>
                    <th onClick={() => handleSort("brand")}>Бренд <SortArrow column="brand" /></th>
                    <th onClick={() => handleSort("model")}>Модель <SortArrow column="model" /></th>
                    <th onClick={() => handleSort("imei")}>IMEI <SortArrow column="imei" /></th>
                    <th onClick={() => handleSort("store")}>Магазин <SortArrow column="store" /></th>
                    <th onClick={() => handleSort("service")}>Сервіс <SortArrow column="service" /></th>
                    <th onClick={() => handleSort("isReturned")}>
    Видано клієнту <SortArrow column="isReturned" />
</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedOrders.map((order) => {
                            const isDelayed =
                                order.repairStatusDate &&
                                dayjs().diff(
                                    dayjs(
                                        order.repairStatusDate.toDate?.() ||
                                            order.repairStatusDate
                                    ),
                                    "days"
                                ) > 14;

                            const rowStyle = {
                                backgroundColor: order.isReturned
                                    ? "lightgreen"
                                    : isDelayed
                                    ? "coral"
                                    : null,
                            };

                            return (
                                <tr
                                    key={order.id}
                                    ref={(el) => (rowRefs.current[order.id] = el)}
                                    className={order.id === highlightId ? styles.highlightRow : ""}
                                    style={rowStyle}
                                    >
                                    <td>
                                    {dayjs(
                                        order.dateReceived?.toDate?.() || order.dateReceived
                                    ).format("DD.MM.YYYY")}
                                    </td>
                                    <td>{order.brand}</td>
                                    <td>{order.model}</td>
                                    <td>{order.imei}</td>
                                    <td>{order.store}</td>
                                    <td>{order.service}</td>
                                    <td>
                                        <Field
                                            type="checkbox"
                                            name="isReturned"
                                            value={order.isReturned}
                                            onChange={() =>
                                                handleMarkAsReturned(order.id)
                                            }
                                            label="Повернено?"
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
};

export default RepairOrdersTable;
