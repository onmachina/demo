import ContainerTable from '../components/tables/ContainerTable';
import { HiPlus } from 'react-icons/hi2';
import { useLoaderData, Outlet, useNavigate, useParams } from 'react-router-dom';

export default function AccountPage() {
  const containers = useLoaderData();
  const navigate = useNavigate();
  const params = useParams();

  const selectedObject = params.object;

  const handleUpload = () => {
    navigate('upload');
  };

  if (!params.container)
    return (
      <>
        <main className="container mx-auto">
          <div className="flex flex-row items-center mb-4 mt-4">
            <h2 className="mr-4">
              {containers.length} {containers.length != 1 ? 'Containers' : 'Container'}
            </h2>
            <button className="px-4 py-2 font-semibold text-sm bg-white rounded-full shadow-sm" onClick={handleUpload}>
              <HiPlus size={22} style={{ display: 'inline-block' }} /> Create Container
            </button>
          </div>
          <ContainerTable containers={containers} />
          <Outlet />
        </main>
      </>
    );

  return <Outlet />;
}

export async function loader(params, x_auth_token) {
  const req = await fetch(`https://api.testnet.onmachina.io/v1/toddmorey.testnet/?format=json`, {
    method: 'GET',
    headers: {
      'x-auth-token': x_auth_token,
    },
  });
  const containers = await req.json();
  console.log(x_auth_token);
  return containers;
}