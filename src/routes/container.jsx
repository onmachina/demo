import ObjectTable from '../components/tables/ObjectTable'
import { HiPlus } from "react-icons/hi2";
import { useLoaderData, Outlet, useNavigate } from 'react-router-dom';

export default function ContainerPage() {

    const  container = useLoaderData();
    const navigate = useNavigate();


   const handleUpload = () => {
        navigate('upload');
    }

    return (
        <>
            <main className="container mx-auto">
                <div className='flex flex-row items-center mb-4 mt-4'>
                    <h2 className='mr-4'>{container.object_count} Objects</h2>
                    <button 
                        className="px-4 py-2 font-semibold text-sm bg-white rounded-full shadow-sm"
                        onClick={handleUpload}
                    >
                        <HiPlus size={22} style={{display: "inline-block"}}/> Upload Object
                    </button>
                </div>
                <Outlet />
                <ObjectTable objects={container.objects} />
            </main>
        </>
    )
}