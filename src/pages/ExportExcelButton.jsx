import { FaFileExcel } from "react-icons/fa";
import { ExportDataToExcel } from "../services/ExportToExcel.js";

const ExportExcelButton = ({ data, fileName = "ExportedData" }) => {
    return (
        <button
            type="button"
            onClick={() => ExportDataToExcel(data, fileName)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition"
        >
            <span>Xuất excel</span>
            <FaFileExcel className="text-xl" />
        </button>
    );
};

export default ExportExcelButton;
