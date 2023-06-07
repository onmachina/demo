import ContainerTable from '../components/tables/ContainerTable';
import { HiPlus } from 'react-icons/hi2';
import { useLoaderData, Outlet, useNavigate, useParams, useLocation, Form, Link, redirect } from 'react-router-dom';
import { useNearAccountContext } from '../contexts/NearContext';
import { addContainer } from '../../lib/onmachina';

export default function AccountPage() {
  const containers = useLoaderData();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const path = location.pathname;

  const selectedObject = params.object;
  const { accountID, authToken } = useNearAccountContext();

  const handleAddContainer = () => {
    addContainer('here-it-is', true, accountID, authToken);
  };

  if (!params.container && !path.includes('shard-list') && !path.includes('settings') && !path.includes('add-node'))
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
              <HiPlus size={22} style={{ display: 'inline-block' }} /> Create Container
            </button>
          </div>
          <ContainerTable containers={containers} />
          <Form className="pt-4" autoComplete="off" method="POST" action={`/`}>
            <div className="mb-6">
              <input name="token" type="hidden" defaultValue={authToken} />
              <input name="accountId" type="hidden" defaultValue={accountID} />
              <label className="block mb-2 text-sm font-medium text-gray-900">Container name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="my-new-container"
                required
                autoFocus
              />
            </div>
            <div className="flex items-start mb-6">
              <label className="relative inline-flex items-center mb-4 cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" name="public" id="public" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900">Make this container public</span>
              </label>
            </div>
            <div className="flex items-center">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              >
                Submit
              </button>
              <Link to="/" className="ml-4 text-sm text-gray-500 hover:text-gray-700">
                Cancel
              </Link>
            </div>
          </Form>
          <Outlet />
        </main>
      </>
    );

  return <Outlet />;
}

export async function loader(params, accountId, x_auth_token) {
  const res = await fetch(`https://api.testnet.onmachina.io/v1/${accountId}/?format=json`, {
    method: 'GET',
    headers: {
      'x-auth-token': x_auth_token,
    },
  });

  // handle the error if an account isn't found
  if (!res.ok) {
    throw new Response('', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const containers = await res.json();

  return containers;
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const token = Object.fromEntries(formData).token;
  const accountId = Object.fromEntries(formData).accountId;
  const containerName = Object.fromEntries(formData).name;
  const isPublic = Object.fromEntries(formData).public;
  await addContainer(containerName, isPublic, accountId, token);
  return redirect(`/`);
}
