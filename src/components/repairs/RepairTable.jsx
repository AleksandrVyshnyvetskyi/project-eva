import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import styles from "../../styles/Repairs.module.css";
import stylesTable from "../../styles/Table.module.css";
import Loader from "../loader/Loader";

const RepairOrdersTable = () => {
  const [repairOrders, setRepairOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRepairOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "repair_orders"));
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

  if (isLoading) {
    return <Loader />;
  }

  if (repairOrders.length === 0) {
    return <p>Поки що немає сервісних відправок...</p>;
  }

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
              const isDelayed =
                order.repairStatusDate &&
                dayjs().diff(
                  dayjs(order.repairStatusDate.toDate?.() || order.repairStatusDate),
                  "days"
                ) > 14;

              const rowStyle = {
                backgroundColor: order.isReturned
                  ? "lightgreen"
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
                    <input
                      className={stylesTable.checkbox}
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
