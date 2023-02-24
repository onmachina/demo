import { HiOutlineDocument } from "react-icons/hi2";
import { formatFileSize } from "@/lib/helper";

export default function ContainerTable({containers}) {

    return (
        <table className="min-w-full table-auto">
            <thead>
                <tr className="bg-gray-800">
                    <th className="px-16 py-2">
                        <HiOutlineDocument/>
                        <span className="text-gray-200">Container Name</span>
                    </th>
                    <th className="px-16 py-2">
                        <span className="text-gray-200">Last Modified</span>
                    </th>  
                    <th className="px-16 py-2">
                        <span className="text-gray-200">Number of objects</span>
                    </th>                                          
                    <th className="px-16 py-2">
                        <span className="text-gray-200">Size</span>
                    </th>
                </tr>                    
            </thead>
            <tbody>
                {containers.map((container, index) => <Row {...container} key={index}/>)}
            </tbody>
        </table>
    )
}

function Row({name, last_modified, bytes, count}){
    return (
        <tr className="bg-gray-50 text-center">
            <td className="px-16 py-2 flex flex-row items-center">
                <span className="text-center ml-2 font-semibold">{name || "Unknown"}</span>
            </td>
            <td className="px-16 py-2">
                <span>{last_modified || "Unknown"}</span>
            </td>
            <td className="px-16 py-2">
                <span>{formatFileSize(bytes) || "0"}</span>
            </td>
            <td className="px-16 py-2">
                <span>{count || "0"}</span>
            </td>
        </tr>
    )
}