import ContainerTable from '../components/tables/ContainerTable';
import { HiPlus } from 'react-icons/hi2';
import { useLoaderData, Outlet, useNavigate, useParams, useLocation, redirect } from 'react-router-dom';
import { auth0AuthProvider } from '../auth';

export default function AccountPage() {
  const { containers } = useLoaderData();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const path = location.pathname;

  const selectedObject = params.object;

  const handleAddContainer = () => {
    navigate('new-container');
  };

  if (!params.container && !path.includes('shard-list') && !path.includes('settings'))
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
          <Outlet />
        </main>
      </>
    );

  return <Outlet />;
}

export async function loader() {
  const isAuthenticated = await auth0AuthProvider.isAuthenticated();
  if (!isAuthenticated) return redirect('/login');

  const username = await auth0AuthProvider.username();
  const token = await auth0AuthProvider.accessToken();
  const avatarUrl = await auth0AuthProvider.avatarUrl();
  const emailVerified = await auth0AuthProvider.emailVerified();
  if (!emailVerified) return redirect('/verify-email');

  const res = await auth0AuthProvider.authenticatedFetch(`/?format=json`, {
    method: 'GET',
  });

  // handle the error if an account isn't found
  if (!res.ok) {
    throw new Response('', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const containers = await res.json();

  return { containers, token, username, avatarUrl, emailVerified };
}
