import { useEffect } from 'react';
import { useParams, useLoaderData, Link, useNavigate, Outlet } from 'react-router-dom';
import MetaDataTable from '../components/tables/MetaDataTable';
import UseEscape from '../hooks/useEscape';

export default function Details({ accountId, authKey }) {
  let { container, object } = useParams();
  const objectData = useLoaderData();
  const fileType = objectData.find((obj) => obj.name === 'content-type').value;
  const navigate = useNavigate();

  useEffect(() => {
    const previewImage = document.querySelector('#preview-image');
    const fetchImage = async () => {
      const response = await fetch(`https://api.testnet.onmachina.io/v1/${accountId}/${container}/${object}`, {
        method: 'GET',
        headers: {
          'x-auth-token': authKey,
        },
      });
      // Create an object URL from the data.
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      // Set the image src to the object URL.
      previewImage.src = objectUrl;
    };
    if (fileType === 'image/jpeg' || fileType === 'image/png') fetchImage();
  }, [object]);

  UseEscape(() => {
    navigate(`/${container}`);
  });

  return (
    <>
      <Outlet />
      <div className="w-2/4 right-0 top-0 h-full absolute z-10 p-4">
        <div className="drop-shadow-xl border border-cyan-300 bg-cyan-100 p-5 mb-5">
          <h2 className="border-b pb-2 mb-2 border-cyan-300">
            Details for {object} <Link to={`/${container}`}>Close</Link>
          </h2>
          <img
            className="block mx-auto mb-2 drop-shadow-md bg-white rounded-md"
            style={{ maxWidth: '400px', maxHeight: '300px' }}
            id="preview-image"
            src="/images/png.png"
            alt={`preview for the object ${object}`}
          />
          <Link to="delete" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">
            Delete
          </Link>
          <MetaDataTable metadata={objectData} />
        </div>
      </div>
    </>
  );
}

export async function loader(params, accountId, x_auth_token) {
  const response = await fetch(
    `https://api.testnet.onmachina.io/v1/${accountId}/${params.container}/${params.object}`,
    {
      method: 'HEAD',
      headers: {
        'x-auth-token': x_auth_token,
      },
    },
  );
  const headersArray = [];
  for (const [name, value] of response.headers.entries()) {
    headersArray.push({ name, value });
  }
  return headersArray;
}
