import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Sales from "../pages/Sales";
import Repairs from "../pages/Repairs";
import Analytics from "../pages/Analytics";
import AdminPanel from "../components/admin/AdminPanel";


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/repairs" element={<Repairs />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/admin/users" element={<AdminPanel />} />
        </Routes>
    );
};

export default AppRoutes;
