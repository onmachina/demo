import ObjectTable from '../components/tables/ObjectTable';
import { HiPlus } from 'react-icons/hi2';
import {
  redirect,
  useLoaderData,
  Outlet,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
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
  const showDelete = searchParams.get('action') === 'delete';
  const showCreate = searchParams.get('action') === 'create';
  const objectName = searchParams.get('object');
  const location = useLocation();

  const { accountID, authToken } = useNearAccountContext();

  const selectedObject = params.object;

  const handleUpload = () => {
    navigate('?action=upload');
  };

  const showUpload = searchParams.get('action') === 'upload';

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
        <EmptyGraphic objects={objects} />
      </main>
    </>
  );
}

function ActionModal() {
  return (
    <div className="grid h-screen place-items-center top-0 bottom-0 left-0 right-0 absolute z-50">
      <div className="w-2/4">
        <div className="drop-shadow-xl border border-red-400 bg-red-100 p-5 mb-5">
          <h2 className="border-b pb-2 mb-2 border-red-400 text-red-700">Modal action</h2>
          <p className="pt-4 pb-4">I'm a happy modal right here.</p>
        </div>
      </div>
    </div>
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
    console.log('uploading object called here!');
    const objectName = Object.fromEntries(formData).name;
    const containerName = Object.fromEntries(formData).container;
    const file = Object.fromEntries(formData).file;

    await uploadObject(containerName, file, accountId, token);
    return redirect(`/${params.container}/`);
  }
  if (action === 'Delete Object') {
    const objectName = Object.fromEntries(formData).name;
    const containerName = Object.fromEntries(formData).container;
    await deleteObject(containerName, objectName, accountId, token);
    return redirect(`/${params.container}/`);
  }
}
