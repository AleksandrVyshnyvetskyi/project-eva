import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "../../styles/Repairs.module.css";
import inv from "../../styles/Sales.module.css";
import RepairForm from "./RepairForm";
import RepairTable from "./RepairTable";

const RepairsContainer = () => {
    const [repairs, setRepairs] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const fetchRepairs = async () => {
        try {
            const querySnapshot = await getDocs(
                collection(db, "repair_orders")
            );
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setRepairs(data);
        } catch (error) {
            console.error("Помилка завантаження замовлення:", error);
            toast.error(
                "Не вдалося завантажити замовлення. Спробуйте ще раз.",
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                }
            );
        }
    };

    const handleMarkAsReturned = async (id) => {
        try {
            const order = repairs.find((r) => r.id === id);
            const updatedValue = !order.isReturned;

            const docRef = doc(db, "repair_orders", id);
            await updateDoc(docRef, { isReturned: updatedValue });

            setRepairs((prev) =>
                prev.map((o) =>
                    o.id === id ? { ...o, isReturned: updatedValue } : o
                )
            );
            toast.success(`Статус для замовлення №${id} оновлено!`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error("Помилка оновлення статуса:", error);
            toast.error("Не вдалося оновити статус. Спробуйте ще раз.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    useEffect(() => {
        fetchRepairs();
    }, []);

    const handleAddRepair = (newRepair) => {
        setRepairs((prev) => [...prev, newRepair]);
    };

    const handleFormToggle = () => {
        setIsFormVisible((prev) => !prev);
    };

    return (
        <>
            <h2 className={styles.title}>⚙️ Відправки в сервіс:</h2>
            <button
                style={{ maxWidth: "20vw", marginBottom: "60px" }}
                className={inv.salesBtn}
                onClick={handleFormToggle}
            >
                {isFormVisible ? "Сховати форму ↑" : "Створити відправку ↓"}
            </button>
            <div
                className={`${inv.formPanel} ${
                    isFormVisible ? inv.visible : ""
                }`}
            >
                <RepairForm onAddRepair={handleAddRepair} />
            </div>

            <RepairTable
                repairs={repairs}
                onMarkAsReturned={handleMarkAsReturned}
            />
        </>
    );
};

export default RepairsContainer;
