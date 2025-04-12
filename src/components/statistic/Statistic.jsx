import { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/uk";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import styles from '../../styles/Statistic.module.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatisticsWithChart = () => {
    const [orders, setOrders] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(dayjs().month());
    const [currentYear, setCurrentYear] = useState(dayjs().year());

    useEffect(() => {
        const fetchOrders = async () => {
            const querySnapshot = await getDocs(collection(db, "sales"));
            const ordersData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setOrders(ordersData);
        };
        fetchOrders();
    }, []);

    const filterOrdersByMonth = (month, year) => {
        return orders.filter((order) => {
            const orderDate = dayjs(order.date);
            return orderDate.month() === month && orderDate.year() === year;
        });
    };

    const filteredOrders = filterOrdersByMonth(currentMonth, currentYear);

    const totalDaysInMonth = dayjs().month(currentMonth).daysInMonth();
    const allDays = Array.from({ length: totalDaysInMonth }, (_, index) => index + 1);

    const ordersByDay = allDays.map((day) => {
        const ordersForDay = filteredOrders.filter(
            (order) => dayjs(order.date).date() === day
        );
        return ordersForDay.length;
    });

    const receivedOrdersByDay = allDays.map((day) => {
        const receivedOrdersForDay = filteredOrders.filter(
            (order) => dayjs(order.date).date() === day && order.received === true
        );
        return receivedOrdersForDay.length;
    });

    const chartData = {
        labels: allDays,
        datasets: [
            {
                label: "Кількість замовлень",
                data: ordersByDay,
                backgroundColor: "blueviolet",
            },
            {
                label: "Отримані замовлення",
                data: receivedOrdersByDay,
                backgroundColor: "#63f1cb",
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: `Статистика інтернет продажів за ${dayjs().month(currentMonth).locale('uk').format('MMMM YYYY').replace(/^./, (match) => match.toUpperCase())}`,
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        const formattedDate = dayjs().month(currentMonth).date(tooltipItem.label).format('DD.MM.YYYY');
                        const label = tooltipItem.datasetIndex === 0 ? "Кількість замовлень" : "Отримані замовлення";
                        return `${label}: ${tooltipItem.raw}\nДень: ${formattedDate}`;
                    },
                },
            },
        },
    };

    return (
        <div className={styles.container}>
            <div className={styles.buttonWrapper}>
                <div>
                    <button
                        onClick={() =>
                            setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1)
                        }
                    >
                        ← Назад
                    </button>
                </div>
                <div>
                    <p>{dayjs().month(currentMonth).locale('uk').format('MMMM YYYY').replace(/^./, (match) => match.toUpperCase())}</p>
                </div>
                <div>
                    {currentMonth !== dayjs().month() || currentYear !== dayjs().year() ? (
                        <button
                            onClick={() =>
                                setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1)
                            }
                        >
                            Вперед →
                        </button>
                    ) : null}
                </div>
            </div>

            <div>
                <h3>Статистика інтернет продажів за {dayjs().month(currentMonth).locale('uk').format('MMMM YYYY').replace(/^./, (match) => match.toUpperCase())}</h3>
                <p>Кількість замовлень: {filteredOrders.length}</p>
                <p>Завершені замовлення: {filteredOrders.filter(order => order.completed).length}</p>
                <p>Ітогова сума: {filteredOrders.reduce((total, order) => total + Number(order.amount), 0)} грн</p>
            </div>

            <div>
                <Bar data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default StatisticsWithChart;
