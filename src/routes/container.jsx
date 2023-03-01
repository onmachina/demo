import ObjectTable from '../components/tables/ObjectTable';
import { HiPlus } from 'react-icons/hi2';
import { useLoaderData, Outlet, useNavigate, useParams } from 'react-router-dom';
import emptyImage from '../assets/empty-container.svg';

export default function ContainerPage() {
  const objects = useLoaderData();
  const navigate = useNavigate();
  const params = useParams();

  const selectedObject = params.object;

  const handleUpload = () => {
    navigate('upload');
  };

  return (
    <>
      <main className="container mx-auto">
        <div className="flex flex-row items-center mb-4 mt-4">
          <h2 className="mr-4">
            {objects.length} {objects.length != 1 ? 'Objects' : 'Object'}
          </h2>
          <button className="px-4 py-2 font-semibold text-sm bg-white rounded-full shadow-sm" onClick={handleUpload}>
            <HiPlus size={22} style={{ display: 'inline-block' }} /> Upload Object
          </button>
        </div>
        <Outlet />
        <ObjectTable objects={objects} selectedObject={selectedObject} />
        <EmptyGraphic objects={objects} />
      </main>
    </>
  );
}

function EmptyGraphic({ objects }) {
  if (objects.length == 0) {
    return (
      <div className="w-full text-center mt-20">
        <img src={emptyImage} alt="empty container" className="mx-auto pl-6 mb-2 opacity-70" />
        <p className="text-slate-400">This container is currently empty.</p>
      </div>
    );
  }
}

export async function loader(params, accountId, x_auth_token) {
  const req = await fetch(`https://api.testnet.onmachina.io/v1/${accountId}/${params.container}/?format=json`, {
    method: 'GET',
    headers: {
      'x-auth-token': x_auth_token,
    },
  });
  const objects = await req.json();
  return objects;
}
