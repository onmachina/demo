import ObjectTable from '../components/tables/ObjectTable';
import { HiOutlineCube, HiPlus } from 'react-icons/hi2';
import EmptyContainerGraphic from '../components/EmptyContainerGraphic';
import { authenticatedFetch } from '../../lib/onmachina';
import { authProvider } from '../../lib/auth';

import {
  redirect,
  useLoaderData,
  Outlet,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
  json,
} from 'react-router-dom';
import DeleteObjectForm from '../components/DeleteObjectForm';
import { deleteObject } from '../../lib/onmachina';
import UploadObjectForm from '../components/UploadObjectForm';

export default function ObjectsView() {
  const { objects, token, accountId } = useLoaderData();

  const navigate = useNavigate();
  const params = useParams();

  const [searchParams, setSearchParams] = useSearchParams();
  const showDelete = searchParams.get('action') === 'delete-object';
  const showCreate = searchParams.get('action') === 'create';
  const objectName = searchParams.get('object');
  const location = useLocation();

  const selectedObject = params.object;
  const container = params.container;

  const handleUpload = () => {
    navigate('?action=upload');
  };

  const showUpload = searchParams.get('action') === 'upload';
  const pageType = params.container ? 'container-page' : 'shard-page';

  return (
    <>
      <main className={`${pageType} flex-1 h-screen -mt-6 px-6 pt-6 bg-ui-base border-l border-ui-base`}>
        <div className="flex flex-row items-center my-3 px-2">
          <HiOutlineCube size={22} />
          <h2 className="ml-2 mr-4 text-ui-muted">
            <div className="inline-block mr-3 text-ui-base">{container}</div>
            {objects.length} {objects.length != 1 ? 'Objects' : 'Object'}
          </h2>
          <button
            className="px-4 py-2 text-sm bg-ui-base border border-ui-base text-ui-active rounded-sm shadow-sm"
            onClick={handleUpload}
          >
            <HiPlus size={22} style={{ display: 'inline-block' }} /> Upload Files
          </button>
        </div>
        {showUpload && <UploadObjectForm containerName={params.container} token={token} accountId={accountId} />}
        <Outlet />
        {showDelete && (
          <DeleteObjectForm
            authToken={authToken}
            accountId={accountId}
            containerName={params.container}
            objectName={objectName}
          />
        )}
        <ObjectTable objects={objects} selectedObject={selectedObject} />
        <EmptyMessage objects={objects} />
      </main>
    </>
  );
}

function EmptyMessage({ objects }) {
  if (objects.length == 0) {
    return (
      <div className="w-full text-center mt-20">
        <div className="mx-auto w-32">
          <EmptyContainerGraphic />
        </div>
        <p className="text-ui-muted">This container is currently empty.</p>
      </div>
    );
  }
}

// Called for any GET request
export async function loader(params) {
  const isAuthenticated = await authProvider.isAuthenticated();
  if (!isAuthenticated) return redirect('/login');

  const user = await authProvider.getUser();
  const token = user.accessToken.value;
  const accountId = user.name;
  console.log(accountId + ' is the account id from the loader.');
  const res = await authenticatedFetch(`/${params.container}/?format=json`, {
    method: 'GET',
  });
  let objects;
  if (res.ok) {
    objects = await res.json();
  } else {
    console.log(res);
    throw res;
  }
  return { objects, token, accountId };
}

// Called for any POST request
export async function action({ request, params }) {
  const formData = await request.formData();
  const action = Object.fromEntries(formData).action;
  const token = Object.fromEntries(formData).token;
  const accountId = Object.fromEntries(formData).accountId;
  if (action === 'Upload Object') {
    return json({ status: 'ok' });
  }
  if (action === 'Delete Object') {
    const objectName = Object.fromEntries(formData).name;
    const containerName = Object.fromEntries(formData).container;
    await deleteObject(containerName, objectName, accountId, token);
    return redirect(`/${params.container}/`);
  }
}
