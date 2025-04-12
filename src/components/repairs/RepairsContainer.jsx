import { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";

import styles from '../../styles/Repairs.module.css';
import RepairForm from './RepairForm';
import RepairTable from './RepairTable';

const RepairsContainer = () => {
    const [repairs, setRepairs] = useState([]);

    const fetchRepairs = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "repair_orders"));
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setRepairs(data);
        } catch (error) {
            console.error("Ошибка загрузки заказов:", error);
        }
    };

    const handleMarkAsReturned = async (id) => {
        try {
            const order = repairs.find(r => r.id === id);
            const updatedValue = !order.isReturned;
    
            const docRef = doc(db, "repair_orders", id);
            await updateDoc(docRef, { isReturned: updatedValue });
    
            setRepairs(prev =>
                prev.map(o =>
                    o.id === id ? { ...o, isReturned: updatedValue } : o
                )
            );
        } catch (error) {
            console.error("Ошибка при обновлении статуса:", error);
        }
    };

    useEffect(() => {
        fetchRepairs();
    }, []);

    const handleAddRepair = (newRepair) => {
        setRepairs(prev => [...prev, newRepair]);
    };

    return (
        <>
            <h2 className={styles.title}>⚙️ Відправки в сервіс:</h2>
            <RepairForm onAddRepair={handleAddRepair} />
            <RepairTable repairs={repairs} onMarkAsReturned={handleMarkAsReturned} />
        </>
    );
};

export default RepairsContainer;
