import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import dayjs from "dayjs";
import styles from "../../styles/Dashboard.module.css";
import { useNavigate } from "react-router-dom";

const DashboardAlerts = () => {
  const [delayedRepairs, setDelayedRepairs] = useState([]);
  const [delayedOrders, setDelayedOrders] = useState([]);
  const [delayedRepairsTotal, setDelayedRepairsTotal] = useState(0);
  const [delayedOrdersTotal, setDelayedOrdersTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const safeDate = (date) => {
    if (!date) return null;
    if (typeof date.toDate === "function") return date.toDate();
    return date;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ================== REPAIRS ==================
        const repairsSnap = await getDocs(collection(db, "repair_orders"));
        const repairs = repairsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        const delayedRepairsAll = repairs.filter(order => {
          const d = safeDate(order.repairStatusDate);
          return d && dayjs().diff(dayjs(d), "day") > 14 && !order.isReturned;
        });

        setDelayedRepairsTotal(delayedRepairsAll.length);

        setDelayedRepairs(
          delayedRepairsAll
            .sort((a, b) =>
              dayjs(safeDate(b.repairStatusDate)).diff(dayjs(safeDate(a.repairStatusDate)))
            )
            .slice(0, 5)
        );

        // ================== SALES ==================
        const salesSnap = await getDocs(collection(db, "sales"));
        const sales = salesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        const delayedSalesAll = sales.filter(order => {
          const d = safeDate(order.date);
          return d && dayjs().diff(dayjs(d), "day") >= 9 && order.status === "Відправлено";
        });

        setDelayedOrdersTotal(delayedSalesAll.length);

        setDelayedOrders(
          delayedSalesAll
            .sort((a, b) =>
              dayjs(safeDate(b.date)).diff(dayjs(safeDate(a.date)))
            )
            .slice(0, 5)
        );
      } catch (e) {
        console.error("Dashboard error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className={styles.heading}>Завантаження...</p>;

  // ====== NAVIGATION HELPERS ======
  const openSale = (order) => {
    const d = safeDate(order.date);
    if (!d) return;

    navigate(
      `/sales?year=${dayjs(d).year()}&month=${dayjs(d).month()}&highlight=${order.id}`
    );
  };

  const openRepair = (order) => {
    navigate(`/repairs?highlight=${order.id}`);
  };

  return (
    <div className={styles.dashboardAlerts}>
      {/* COUNTERS */}
      <div className={styles.alertCounters}>
        <div
          className={styles.alertCounter}
          style={{ backgroundColor: delayedOrdersTotal ? "coral" : "var(--bg)" }}
          onClick={() => navigate("/sales")}
        >
          Просрочені інтернет-замовлення: {delayedOrdersTotal}
        </div>

        <div
          className={styles.alertCounter}
          style={{ backgroundColor: delayedRepairsTotal ? "coral" : "var(--bg)" }}
          onClick={() => navigate("/repairs")}
        >
          Просрочені сервісні заявки: {delayedRepairsTotal}
        </div>
      </div>

      {/* REPAIRS */}
      {delayedRepairs.length > 0 && (
        <div className={`${styles.alert} ${styles.repairAlert}`}>
          <h3>⚠️ Просрочені сервісні заявки</h3>
          <ul>
            {delayedRepairs.map(order => {
              const d = safeDate(order.repairStatusDate);
              return (
                <li
                  key={order.id}
                  className={styles.delayedItem}
                  onClick={() => openRepair(order)}
                >
                  {d ? dayjs(d).format("DD.MM.YYYY") : "Немає дати"} —{" "}
      <strong>{order.brand} {order.model}</strong>
      {order.service && ` (${order.service})`}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* SALES */}
      {delayedOrders.length > 0 && (
        <div className={`${styles.alert} ${styles.orderAlert}`}>
          <h3>⚠️ Просрочені інтернет-замовлення</h3>
          <ul>
            {delayedOrders.map(order => {
              const d = safeDate(order.date);
              return (
                <li
                  key={order.id}
                  className={styles.delayedItem}
                  onClick={() => openSale(order)}
                >
                  {d ? dayjs(d).format("DD.MM.YYYY") : "Немає дати"} — {order.items?.join(", ")}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {delayedOrdersTotal === 0 && delayedRepairsTotal === 0 && (
        <div className={`${styles.alert} ${styles.noDelay}`}>
          ✅ Просрочених заявок немає
        </div>
      )}
    </div>
  );
};

export default DashboardAlerts;
