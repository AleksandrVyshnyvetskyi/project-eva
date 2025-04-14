import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    getDoc,
} from "firebase/firestore";
import dayjs from "dayjs";
import "dayjs/locale/uk";
import { ToastContainer, toast } from "react-toastify";
import * as XLSX from "xlsx";
import SaleForm from "../components/sales/SaleForm";
import SalesTable from "../components/sales/SalesTable";
import Loader from "../components/loader/Loader";
import Button from "../components/common/Button";
import styles from "../styles/Sales.module.css";

const Sales = () => {
    dayjs.locale("uk");
    const [sales, setSale] = useState([]);
    const [received, setReceived] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [isInputVisible, setIsInputVisible] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(dayjs().month());
    const [currentYear, setCurrentYear] = useState(dayjs().year());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "sales"));
                const salesData = querySnapshot.docs
                    .filter((doc) => doc.exists())
                    .map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                const salesReceived = salesData.reduce((acc, sale) => {
                    acc[sale.id] = sale.received || false;
                    return acc;
                }, {});

                setSale(salesData);
                setReceived(salesReceived);
            } catch (error) {
                toast.error("Помилка при завантаженні даних продажу");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSales();
    }, []);

    if (isLoading) {
        return <Loader />;
    }
    
    const handleFormToggle = () => {
        setIsFormVisible((prev) => !prev);
    };

    const addSale = async (newSale) => {
        try {
            const docRef = await addDoc(collection(db, "sales"), newSale);
            setSale((prevSales) => [
                ...prevSales,
                { id: docRef.id, ...newSale },
            ]);
            setReceived((prev) => ({ ...prev, [docRef.id]: false }));
        } catch (e) {
            console.error("Помилка при додаванні документа: ", e);
            toast.error("Помилка при додаванні документа");
        }
    };

    const handleButtonClick = () => {
        setIsInputVisible((prev) => !prev);
    };

    const handleCheckboxChange = async (id) => {
        if (!id) return;

        const newValue = !received[id];
        setReceived((prev) => ({ ...prev, [id]: newValue }));

        try {
            const saleRef = doc(db, "sales", id);
            const saleSnapshot = await getDoc(saleRef);

            if (saleSnapshot.exists()) {
                await updateDoc(saleRef, { received: newValue });
                console.log(
                    `Обновлён статус заказа с id: ${id}, получено: ${newValue}`
                );
                toast.success("✅ Видано клієнту!");
            } else {
                setReceived((prev) => {
                    const { [id]: removed, ...rest } = prev;
                    return rest;
                });
                console.error(`Заказ с id: ${id} не найден!`);
            }
        } catch (error) {
            toast.error("Помилка при оновленні received");
            console.error("Помилка при оновленні received:", error);
        }
    };

    const normalizePhoneNumber = (phone) => {
        return phone.replace(/[^\d]/g, "").toLowerCase();
    };

    const normalizeString = (str) => {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    };

    const filteredByMonth = sales.filter((sale) => {
        const saleDate = dayjs(sale.date);
        return (
            saleDate.month() === currentMonth && saleDate.year() === currentYear
        );
    });

    const sortedSales = filteredByMonth
        .filter((sale) => {
            const normalizedSearchQuery = normalizeString(searchQuery);
            const normalizedPhone = normalizePhoneNumber(sale.phone);

            const searchMatch =
                normalizeString(sale.orderNumber).includes(
                    normalizedSearchQuery
                ) ||
                dayjs(sale.date).format("DD.MM.YYYY").includes(searchQuery) ||
                normalizeString(sale.address).includes(normalizedSearchQuery) ||
                normalizeString(sale.client).includes(normalizedSearchQuery) ||
                sale.items.some((item) =>
                    normalizeString(item).includes(normalizedSearchQuery)
                ) ||
                normalizedPhone.includes(normalizedSearchQuery);

            const isCompleted = received[sale.id];
            const isOverdue = dayjs().diff(dayjs(sale.date), "day") >= 9;

            if (filterStatus === "completed") return searchMatch && isCompleted;
            if (filterStatus === "notCompleted")
                return searchMatch && !isCompleted;
            if (filterStatus === "overdue") return searchMatch && isOverdue;

            return searchMatch;
        })
        .sort((a, b) => {
            const dateA = dayjs(a.date).format("YYYY-MM-DD");
            const dateB = dayjs(b.date).format("YYYY-MM-DD");
        
            if (dateA < dateB) return -1;
            if (dateA > dateB) return 1;
        
            return Number(a.orderNumber) - Number(b.orderNumber);
        });

    const downloadExcel = () => {
        const filteredSales = sales.filter((sale) => {
            const saleDate = dayjs(sale.date);
            return (
                saleDate.month() === currentMonth &&
                saleDate.year() === currentYear
            );
        });

        const sortedSales = filteredSales.sort((a, b) => {
            const dateA = dayjs(a.date);
            const dateB = dayjs(b.date);
            return dateB.isBefore(dateA) ? 1 : -1;
        });

        const dataForExcel = sortedSales.map((sale) => ({
            "Номер замовлення": sale.orderNumber,
            Дата: dayjs(sale.date).format("DD.MM.YYYY"),
            Товар: sale.items.join(", "),
            "Ім'я клієнта": sale.client,
            Телефон: sale.phone,
            Адреса: sale.address,
            "Форма оплати": sale.payment,
            Сума: sale.amount,
            ТТН: sale.ttn,
            Отримано: sale.received ? "Так" : "Ні",
        }));

        const ws = XLSX.utils.json_to_sheet(dataForExcel);

        const wscols =
            dataForExcel[0] &&
            Object.keys(dataForExcel[0]).map((col) => ({
                wch:
                    Math.max(
                        ...dataForExcel.map((row) => row[col].toString().length)
                    ) + 2,
            }));
        ws["!cols"] = wscols;

        dataForExcel.forEach((sale, rowIndex) => {
            if (sale["Отримано"] === "Так") {
                const cellAddress = XLSX.utils.encode_cell({
                    r: rowIndex + 1,
                    c: 9,
                });
                if (ws[cellAddress]) {
                    ws[cellAddress].s = {
                        fill: { fgColor: { rgb: "90EE90" } },
                    };
                }
            }
        });

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Замовлення");

        XLSX.writeFile(
            wb,
            `Інтернет_продажі_${dayjs()
                .month(currentMonth)
                .year(currentYear)
                .format("MMMM_YYYY")}.xlsx`
        );
    };

    return (
        <>
            <h2 className={styles.title}>📦 Продажі:</h2>
            <div className={styles.container}>
                <div className={styles.left}>
                    <Button variant="button" onClick={handleFormToggle}>{isFormVisible
                            ? "Сховати форму ↑"
                            : "Створити замовлення ↓"}</Button>
                    <div
                        className={`${styles.formPanel} ${
                            isFormVisible ? styles.visible : ""
                        }`}
                    >
                        <SaleForm onAdd={addSale} />
                    </div>
                </div>
                <div className={styles.right}>
                    <Button variant="button" onClick={handleButtonClick}>{isInputVisible ? "Сховати ↑" : "Пошук ↓"}</Button>
                    <div
                        className={`${styles.searchPanel} ${
                            isInputVisible ? styles.visible : ""
                        }`}
                    >
                        <div className={styles.group}>
                            <svg
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className={styles.searchIcon}
                            >
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

            <div className={styles.monthNavigation}>
                <div>
                <Button variant="button" type="submit" onClick={() => {
                            const newDate = dayjs()
                                .year(currentYear)
                                .month(currentMonth)
                                .subtract(1, "month");
                            setCurrentMonth(newDate.month());
                            setCurrentYear(newDate.year());
                        }}>← Назад</Button>
                </div>
                <div>
                    <p>
                        {dayjs()
                            .year(currentYear)
                            .month(currentMonth)
                            .format("MMMM YYYY")
                            .replace(/^./, (c) => c.toUpperCase())}
                    </p>
                </div>
                <div>
                    {(currentMonth !== dayjs().month() ||
                        currentYear !== dayjs().year()) && (
                            <Button variant="button" onClick={() => {
                                const newDate = dayjs()
                                    .year(currentYear)
                                    .month(currentMonth)
                                    .add(1, "month");
                                setCurrentMonth(newDate.month());
                                setCurrentYear(newDate.year());
                            }}>Вперед →{" "}</Button>
                    )}
                </div>
            </div>
            <SalesTable
                data={sortedSales}
                received={received}
                handleCheckboxChange={handleCheckboxChange}
            />
            <div className={styles.containerForDownloadBtn}>
            <Button variant="buttonSubmit" onClick={downloadExcel}>Завантажити Excel</Button>
            </div>
            <ToastContainer />
        </>
    );
};

export default Sales;
