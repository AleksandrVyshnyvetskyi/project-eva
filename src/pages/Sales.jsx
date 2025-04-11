import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import dayjs from "dayjs";
import SaleForm from "../components/sales/SaleForm";
import SalesTable from "../components/sales/SalesTable";
import styles from '../styles/Sales.module.css';

const Sales = () => {
    const [sales, setSale] = useState([]);
    const [received, setReceived] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isInputVisible, setIsInputVisible] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);

    useEffect(() => {
        const fetchSales = async () => {
            const querySnapshot = await getDocs(collection(db, "sales"));
            const salesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSale(salesData);
        };
        fetchSales();
    }, []);

    const handleFormToggle = () => {
        setIsFormVisible(prev => !prev);
    };

    const addSale = async (newSale) => {
        try {
            const docRef = await addDoc(collection(db, "sales"), newSale);
            setSale(prevSales => [...prevSales, { id: docRef.id, ...newSale }]);
        } catch (e) {
            console.error("Ошибка при добавлении документа: ", e);
        }
    };

    const handleButtonClick = () => {
        setIsInputVisible((prev) => !prev);
    };

    const handleCheckboxChange = async (id) => {
        setReceived((prev) => {
            const updatedReceived = { ...prev, [id]: !prev[id] };
            return updatedReceived;
        });
    
        const saleRef = doc(db, "sales", id);
        await updateDoc(saleRef, {
            received: !received[id],
        });
    };

    useEffect(() => {
        const fetchSales = async () => {
            const querySnapshot = await getDocs(collection(db, "sales"));
            const salesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
    
            // Формируем объект для хранения состояния чекбоксов
            const salesReceived = salesData.reduce((acc, sale) => {
                acc[sale.id] = sale.received || false; // По умолчанию false, если нет значения в Firebase
                return acc;
            }, {});
    
            setSale(salesData);
            setReceived(salesReceived);
        };
    
        fetchSales();
    }, []);

    const normalizePhoneNumber = (phone) => {
        return phone.replace(/[^\d]/g, '').toLowerCase();
    };
    
    const normalizeString = (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    };

    const sortedSales = sales
        .filter(sale => {
            const normalizedSearchQuery = normalizeString(searchQuery);
            const normalizedPhone = normalizePhoneNumber(sale.phone);

            const searchMatch =
                normalizeString(sale.orderNumber).includes(normalizedSearchQuery) ||
                dayjs(sale.date).format('DD.MM.YYYY').includes(searchQuery) ||
                normalizeString(sale.client).includes(normalizedSearchQuery) ||
                sale.items.some(item => normalizeString(item).includes(normalizedSearchQuery)) ||
                normalizedPhone.includes(normalizedSearchQuery);

            const isCompleted = received[sale.id];
            const isOverdue = dayjs().diff(dayjs(sale.date), 'day') >= 9;

            if (filterStatus === 'completed') return searchMatch && isCompleted;
            if (filterStatus === 'notCompleted') return searchMatch && !isCompleted;
            if (filterStatus === 'overdue') return searchMatch && isOverdue;

            return searchMatch;
        })
        .sort((a, b) => dayjs(b.date).isAfter(dayjs(a.date)) ? 1 : -1);

    return (
        <>
            <h2 className={styles.title}>📦 Продажі:</h2>
            <div className={styles.container}>
            <div className={styles.left}>
                <button className={styles.createBtn} onClick={handleFormToggle}>
                    {isFormVisible ? 'Сховати форму ↑' : 'Створити замовлення ↓'}
                </button>
                <div className={`${styles.formPanel} ${isFormVisible ? styles.visible : ''}`}>
                    <SaleForm onAdd={addSale} />
                </div>
            </div>
                <div className={styles.right}>
                    <button className={styles.searchBtn} onClick={handleButtonClick}>
                        {isInputVisible ? 'Сховати ↑' : 'Пошук ↓'}
                    </button>
                    <div className={`${styles.searchPanel} ${isInputVisible ? styles.visible : ''}`}>
                        <div className={styles.group}>
                            <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.searchIcon}>
                                <g>
                                    <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
                                </g>
                            </svg>
                            <input
                                className={styles.searchInput}
                                type="text"
                                placeholder="Введіть значення"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select
                            className={styles.searchSelect}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            value={filterStatus}
                        >
                            <option value="all">Усі</option>
                            <option value="completed">Завершені</option>
                            <option value="notCompleted">Не завершені</option>
                            <option value="overdue">Просрочені</option>
                        </select>
                    </div>
                </div>
            </div>
            <SalesTable data={sortedSales} received={received} setReceived={setReceived} />
        </>
    );
};

export default Sales;
