import { HiOutlineDocument } from "react-icons/hi2";
import { formatDate } from "@/lib/helper"
import { formatFileSize } from "@/lib/helper";

export default function ObjectTable({objects}) {

    return (
        <table className="min-w-full table-auto">
            <thead>
                <tr className="bg-gray-800">
                    <th className="px-16 py-2">
                        <span className="text-gray-200">File Name</span>
                    </th>
                    <th className="px-16 py-2">
                        <span className="text-gray-200">Date Modified</span>
                    </th>  
                    <th className="px-16 py-2">
                        <span className="text-gray-200">Size</span>
                    </th>                                          
                    <th className="px-16 py-2">
                        <span className="text-gray-200">Type</span>
                    </th>
                </tr>                    
            </thead>
            <tbody>
                {objects.map((object, index) => <Row {...object} key={index}/>)}
            </tbody>
        </table>
    )
}

function Row({hash, last_modified, bytes, name, content_type}){
    return (
        <tr className="bg-gray-50 text-center">
            <td className="px-16 py-2 flex flex-row items-center">
                <HiOutlineDocument size={22} />
                <span className="text-center ml-2 font-semibold">{name || "Unknown"}</span>
            </td>
            <td className="px-16 py-2">
                <span>{formatDate(last_modified)}</span>
            </td>
            <td className="px-16 py-2">
                <span>{formatFileSize(bytes) || "0"}</span>
            </td>
            <td className="px-16 py-2">
                <span>{content_type || "Unknown"}</span>
            </td>
        </tr>
    )
}