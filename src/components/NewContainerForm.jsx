import { Link, Form } from 'react-router-dom';
import debounce from 'lodash/debounce';

export default function NewContainerForm({ authToken, accountID }) {
  // ensure the container name is URL apporpriate
  const slugify = debounce((event) => {
    const containerName = event.target.value;
    const slug = containerName.toLowerCase().replace(/[\W_]+/g, '-');
    event.target.value = slug;
  }, 200);

  const handleInputChange = (event) => {
    slugify(event);
  };

  return (
    <Form className="pt-4" autoComplete="off" method="POST" action={`/`}>
      <div className="mb-6">
        <input name="action" type="hidden" defaultValue="Create Container" />
        <input name="token" type="hidden" defaultValue={authToken} />
        <input name="accountId" type="hidden" defaultValue={accountID} />
        <label className="block mb-2 text-sm font-medium text-gray-900">Container name</label>
        <input
          type="text"
          id="name"
          name="name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="my-new-container"
          onChange={handleInputChange}
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
  );
}
