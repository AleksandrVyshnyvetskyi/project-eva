import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import dayjs from "dayjs";
import styles from '../../styles/Repairs.module.css';
import stylesTable from '../../styles/Table.module.css';
import { toast } from "react-toastify";

const RepairOrdersTable = () => {
    const [repairOrders, setRepairOrders] = useState([]);
    if (!repairOrders.length) return <p>Поки що немає сервісних відправок...</p>;
    useEffect(() => {
        const fetchRepairOrders = async () => {
            const querySnapshot = await getDocs(collection(db, "repair_orders"));
            const ordersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setRepairOrders(ordersData);
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

    return (
        <div className={styles.tableWrapper}>
            <table>
                <thead>
                    <tr>
                        <th>Дата приймання</th>
                        <th>Бренд</th>
                        <th>Модель</th>
                        <th>IMEI</th>
                        <th>Магазин</th>
                        <th>Сервіс</th>
                        <th>Видано клієнту</th>
                    </tr>
                </thead>
                <tbody>
                    {repairOrders
                        .sort((a, b) => {
                            const dateA = dayjs(a.dateReceived);
                            const dateB = dayjs(b.dateReceived);
                            return dateB - dateA; 
                        })
                        .map((order) => {
                            const isDelayed = order.repairStatusDate &&
                                dayjs().diff(
                                    dayjs(order.repairStatusDate.toDate?.() || order.repairStatusDate),
                                    "days"
                                ) > 14;

                        const rowStyle = {
                            backgroundColor: order.isReturned
                                ? "lightgreen" // светло-зелёный
                                : isDelayed
                                ? "coral"
                                : "transparent",
                        };

                        return (
                            <tr key={order.id} style={rowStyle}>
                                <td>{dayjs(order.dateReceived).format("DD.MM.YYYY")}</td>
                                <td>{order.brand}</td>
                                <td>{order.model}</td>
                                <td>{order.imei}</td>
                                <td>{order.store}</td>
                                <td>{order.service}</td>
                                <td>
                                    <input className={stylesTable.checkbox}
                                        type="checkbox"
                                        checked={order.isReturned}
                                        onChange={() => handleMarkAsReturned(order.id)}
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
