import { ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import RepairsContainer from "../components/repairs/RepairsContainer";

const Repairs = () => {
    const location = useLocation();
    const highlightId = new URLSearchParams(location.search).get("highlight");
  
    return (
      <>
        <RepairsContainer highlightId={highlightId} />
        <ToastContainer />
      </>
    );
  };

export default Repairs;
