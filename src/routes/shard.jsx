import ContainerTable from '../components/tables/ContainerTable';
import { HiPlus } from 'react-icons/hi2';
import { useLoaderData, Outlet, useNavigate, useParams, useLocation, Form, Link, redirect } from 'react-router-dom';
import { useNearAccountContext } from '../contexts/NearContext';
import { addContainer } from '../../lib/onmachina';
import { deleteContainer } from '../../lib/onmachina';
import DeleteContainerForm from '../components/DeleteContainerForm';
import NewContainerForm from '../components/NewContainerForm';
import { useSearchParams } from 'react-router-dom';
import { red } from 'bn.js';

export default function AccountPage() {
  const containers = useLoaderData();
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const showDelete = searchParams.get('action') === 'delete-container';
  const showCreate = searchParams.get('action') === 'create-container';
  const containerName = searchParams.get('container');
  const location = useLocation();
  const path = location.pathname;

  const selectedContainer = params.container;
  const { accountID, authToken } = useNearAccountContext();

  const handleAddContainer = () => {
    navigate(`/?action=create-container`);
  };

  const pageType = params.container ? 'container-page' : 'shard-page';
  const flexClasses = params.container ? 'flex-shrink-0 min-w-fit mr-1' : 'w-full mr-1';

  if (!path.includes('shard-list') && !path.includes('settings'))
    return (
      <>
        <main className={`${pageType} container mx-auto text-ui-muted ui-panel-muted bg-ui-base`}>
          {showCreate && <NewContainerForm authToken={authToken} accountID={accountID} />}
          {showDelete && (
            <DeleteContainerForm authToken={authToken} accountID={accountID} containerName={containerName} />
          )}

          <div className="flex">
            <div className={flexClasses}>
              <div className="mb-4 px-3 mt-2.5">
                <button
                  className="mb-4 px-4 py-2 text-sm bg-ui-base border border-ui-base text-ui-active rounded-sm shadow-sm"
                  onClick={handleAddContainer}
                >
                  <HiPlus size={22} style={{ display: 'inline-block' }} /> Create Container
                </button>
                <h2>
                  {containers.length} {containers.length != 1 ? 'Containers' : 'Container'}
                </h2>
              </div>
              <ContainerTable containers={containers} selectedContainer={selectedContainer} />
            </div>
            <Outlet />
          </div>
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

  if (!params.container) return redirect(`/audio-english`);

  return containers;
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const action = Object.fromEntries(formData).action;
  const token = Object.fromEntries(formData).token;
  const accountId = Object.fromEntries(formData).accountId;
  if (action === 'Create Container') {
    const containerName = Object.fromEntries(formData).name;
    const isPublic = Object.fromEntries(formData).public;
    await addContainer(containerName, isPublic, accountId, token);
    return redirect(`/`);
  }
  if (action === 'Delete Container') {
    console.log('delete container');
    const containerName = Object.fromEntries(formData).name;
    await deleteContainer(containerName, accountId, token);
    return redirect(`/`);
  }
}
