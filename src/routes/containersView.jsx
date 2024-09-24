import ContainerTable from '../components/tables/ContainerTable';
import { HiPlus } from 'react-icons/hi2';
import { useLoaderData, Outlet, useNavigate, useParams, useLocation, Form, Link, redirect } from 'react-router-dom';
import { addContainer, deleteContainer } from '../../lib/onmachina';
import DeleteContainerForm from '../components/DeleteContainerForm';
import NewContainerForm from '../components/NewContainerForm';
import { useSearchParams } from 'react-router-dom';
import { authenticatedFetch } from '../../lib/onmachina';
import { authProvider } from '../../lib/auth';

export default function ContainerView() {
  const { containers } = useLoaderData();
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const showDelete = searchParams.get('action') === 'delete-container';
  const showCreate = searchParams.get('action') === 'create-container';
  const selectedContainerName = searchParams.get('container');

  const selectedContainer = params.container;

  const handleAddContainer = () => {
    navigate(`/?action=create-container`);
  };

  const pageType = params.container ? 'container-page' : 'shard-page';
  const flexClasses = params.container ? 'flex-shrink-0 min-w-fit mx-6' : 'w-full mx-6';

  return (
    <>
      <main className={`${pageType} text-ui-muted bg-ui-base`}>
        {showCreate && <NewContainerForm />}
        {showDelete && selectedContainerName && <DeleteContainerForm containerName={selectedContainerName} />}

        <div className="flex">
          <div className={flexClasses}>
            <div className="mb-4 mt-2.5">
              <button
                className="mb-4 px-4 py-2 text-sm bg-ui-base border border-ui-base text-ui-active rounded-sm shadow-md w-full max-w-[15em]"
                onClick={handleAddContainer}
              >
                <HiPlus size={22} style={{ display: 'inline-block' }} /> Create Container
              </button>
              <h2 className="text-center">
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
}

export async function loader() {
  const isAuthenticated = await authProvider.isAuthenticated();
  if (!isAuthenticated) return redirect('/login');

  const user = await authProvider.getUser();

  const username = user.username;
  const token = user.accessToken;
  const avatarUrl = user.avatarUrl;
  const emailVerified = user.emailVerified;

  let containers = [];

  // return empty json if email not verified
  if (!emailVerified) return { containers, token, username, avatarUrl, emailVerified };

  const res = await authenticatedFetch(`/?format=json`, {
    method: 'GET',
  });

  if (res.ok) {
    containers = await res.json();
  } else {
    console.log(res);
    throw res;
  }

  return { containers, token, username, avatarUrl, emailVerified };
}

export async function action({ request }) {
  const formData = await request.formData();
  const action = Object.fromEntries(formData).action;
  if (action === 'Create Container') {
    const containerName = Object.fromEntries(formData).name;
    const isPublic = Object.fromEntries(formData).public;
    await addContainer(containerName, isPublic);
    return redirect(`/`);
  }
  if (action === 'Delete Container') {
    console.log('delete container');
    const containerName = Object.fromEntries(formData).name;
    await deleteContainer(containerName);
    return redirect(`/`);
  }
}
