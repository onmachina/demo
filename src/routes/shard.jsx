import ContainerTable from '../components/tables/ContainerTable';
import { HiPlus } from 'react-icons/hi2';
import { useLoaderData, Outlet, useNavigate, useParams, useLocation } from 'react-router-dom';

export default function AccountPage() {
  const containers = useLoaderData();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const path = location.pathname;

  const selectedObject = params.object;

  const handleAddContainer = () => {
    navigate('new-container');
  };

  if (!params.container && !path.includes('shard-list'))
    return (
      <>
        <main className="container mx-auto">
          <div className="flex flex-row items-center mb-4 mt-4">
            <h2 className="mr-4">
              {containers.length} {containers.length != 1 ? 'Containers' : 'Container'}
            </h2>
            <button
              className="px-4 py-2 font-semibold text-sm bg-white rounded-full shadow-sm"
              onClick={handleAddContainer}
            >
              <HiPlus size={22} style={{ display: 'inline-block' }} /> Create Container {location.pathname}
            </button>
          </div>
          <ContainerTable containers={containers} />
          <Outlet />
        </main>
      </>
    );

  return <Outlet />;
}

export async function loader(params, accountId, x_auth_token) {
  const req = await fetch(`https://api.testnet.onmachina.io/v1/${accountId}/?format=json`, {
    method: 'GET',
    headers: {
      'x-auth-token': x_auth_token,
    },
  });
  const containers = await req.json();

  return containers;
}
