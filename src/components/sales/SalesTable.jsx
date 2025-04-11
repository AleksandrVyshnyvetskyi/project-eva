import dayjs from 'dayjs';
import styles from '../../styles/Table.module.css';

const SalesTable = ({ data, received, setReceived }) => {
    if (!data.length) return <p>Поки що немає продажів...</p>;

    const handleCheckboxChange = (id) => {
        setReceived((prev) => {
            const updatedReceived = { ...prev, [id]: !prev[id] };
            return updatedReceived;
        });
    };

    const isOldOrder = (date) => {
        return dayjs().diff(dayjs(date), 'day') >= 9;
    };

    return (
        <table border="1" cellPadding={5}>
            <thead>
                <tr>
                    <th>№</th>
                    <th>Дата</th>
                    <th>Товар</th>
                    <th>Ім'я клієнта</th>
                    <th>Телефон</th>
                    <th>Адреса</th>
                    <th>Форма оплати</th>
                    <th>Сума</th>
                    <th>ТТН</th>
                    <th>Отримано</th>
                </tr>
            </thead>
            <tbody>
                {data.map((sale) => (
                    <tr
                        key={sale.id}
                        style={{
                            backgroundColor: received[sale.id]
                                ? 'lightgreen'
                                : isOldOrder(sale.date) && !received[sale.id]
                                ? 'coral'
                                : 'transparent',
                        }}
                    >
                        <td>{sale.orderNumber}</td>
                        <td>{dayjs(sale.date).format('DD.MM.YYYY')}</td>
                        <td>{sale.items.map((item, index) => <p key={index}>{item}</p>)}</td>
                        <td>{sale.client}</td>
                        <td>{sale.phone}</td>
                        <td>{sale.address}</td>
                        <td>{sale.payment}</td>
                        <td>{sale.amount}</td>
                        <td>{sale.ttn}</td>
                        <td>
                            <input
                                className={styles.checkbox}
                                type="checkbox"
                                checked={received[sale.id] || false}
                                onChange={() => handleCheckboxChange(sale.id)}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default SalesTable;