import SaleForm from "../components/sales/SaleForm";
import SalesTable from "../components/sales/SalesTable";
import { useState } from "react";

import styles from '../styles/Sales.module.css'

const Sales = () => {
    const [sales, setSale] = useState([]);

    const addSale = (newSale) => {
        setSale((prev) => [...prev, newSale])
    }

    return (
    <>
        <h2 className={styles.title}>📦 Продажі:</h2>
        <SaleForm onAdd={addSale} />
        <SalesTable data={sales} />
    </>
    )
}

export default Sales;