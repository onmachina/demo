import ObjectTable from '../components/tables/ObjectTable';
import { HiOutlineCube, HiPlus } from 'react-icons/hi2';
import EmptyContainerGraphic from '../components/EmptyContainerGraphic';

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
import emptyImage from '../assets/empty-container.svg';
import DeleteObjectForm from '../components/DeleteObjectForm';
import { useNearAccountContext } from '../contexts/NearContext';
import { deleteObject } from '../../lib/onmachina';
import UploadObjectForm from '../components/UploadObjectForm';
import { uploadObject } from '../../lib/onmachina';

export default function ContainerPage() {
  const objects = useLoaderData();
  const navigate = useNavigate();
  const params = useParams();

  const [searchParams, setSearchParams] = useSearchParams();
  const showDelete = searchParams.get('action') === 'delete-object';
  const showCreate = searchParams.get('action') === 'create';
  const objectName = searchParams.get('object');
  const location = useLocation();

  const { accountID, authToken } = useNearAccountContext();

  const selectedObject = params.object;
  const container = params.container;

  const handleUpload = () => {
    navigate('?action=upload');
  };

  const showUpload = searchParams.get('action') === 'upload';
  const pageType = params.container ? 'container-page' : 'shard-page';

  return (
    <>
      <main className={`${pageType} container mx-auto ui-panel-muted border border-ui-base`}>
        <div className="flex flex-row items-center my-2 px-2">
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
        {showUpload && (
          <UploadObjectForm authToken={authToken} accountID={accountID} containerName={params.container} />
        )}
        <Outlet />
        {showDelete && (
          <DeleteObjectForm
            authToken={authToken}
            accountID={accountID}
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
