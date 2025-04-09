import styles from '../../styles/Table.module.css'

const SalesTable = ({ data }) => {
    if (!data.length) return <p>Поки що немає продажів...</p>;

    return (
        <table border="1" cellPadding={5}>
            <thead>
                <tr>
                    <th>Дата</th>
                    <th>Товар</th>
                    <th>Ім'я клієнта</th>
                    <th>Адреса</th>
                    <th>Форма оплати</th>
                </tr>
            </thead>
            <tbody>
                {data.map((sale) => (
                    <tr key={sale.id}>
                        <td>{sale.date}</td>
                        <td>
                            {/* Рендерим каждый товар на новой строке */}
                            {sale.items.map((item, index) => (
                                <p key={index}>{item}</p> // Каждый товар в новом параграфе
                            ))}
                        </td>
                        <td>{sale.client}</td>
                        <td>{sale.address}</td>
                        <td>{sale.payment}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default SalesTable;
