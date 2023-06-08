import { useEffect, useState } from 'react';
import { Link, Form } from 'react-router-dom';
import { formatFileSize } from '../../lib/utils';
import { fetchObjectMetadata } from '../../lib/onmachina';

export default function DeleteObjectForm({ containerName, objectName, authToken, accountID }) {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metadata = await fetchObjectMetadata(containerName, objectName, accountID, authToken);
        setMetadata(metadata);
        console.log(metadata);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [objectName]);

  if (loading) return;

  return (
    <div className="w-2/4">
      <div className="drop-shadow-xl border border-red-400 bg-red-100 p-5 mb-5">
        <h2 className="border-b pb-2 mb-2 border-red-400 text-red-700">Delete {objectName}</h2>
        <p>
          Are you sure you want to delete the object <strong>{objectName}</strong>? It is{' '}
          {formatFileSize(metadata['content-length'])} in size. This action cannot be undone.
        </p>
        <Form method="POST" action={`/${containerName}`}>
          <input name="action" type="hidden" value="Delete Object" />
          <input name="token" type="hidden" value={authToken} />
          <input name="accountId" type="hidden" value={accountID} />
          <input name="container" type="hidden" value={containerName} />
          <input name="name" type="hidden" value={objectName} />

          <div className="flex space-x-2 pt-4">
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full" type="submit">
              Yes, Delete
            </button>
            <Link to={`/${containerName}`} className="text-red-700 py-2 px-4">
              No, cancel
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
