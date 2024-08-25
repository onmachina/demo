import { useEffect, useState } from 'react';
import CodeBlock from '../components/CodeBlock';
import { authProvider } from '../../lib/auth';

export default function SettingsView() {
  const [accountID, setAccountId] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await authProvider.getUser();
        const authToken = user.accessToken.value;
        const accountID = user.name;
        setAccountId(accountID);
        setAuthToken(authToken);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [accountID, authToken]);

  return (
    <div className="container ml-8 max-w-2xl text-slate-400 mb-4">
      <h1 className="text-3xl mb-4 font-bold text-white">Account Settings</h1>

      <div class="p-4 mb-4  text-cyan-100 border border-cyan-800 bg-cyan-700" role="alert">
        <span class="font-medium">Note:</span> Your API access token from OnMachina will change and need to be refreshed
        every 24 hours. On this page, you can see your current API key.
      </div>

      <table class="min-w-full table-auto mt-8">
        <thead>
          <tr>
            <th class="sr-only">
              <span>Name</span>
            </th>
            <th class="sr-only">
              <span>Value</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-ui-active text-center">
            <td className="px-3 py-2 flex flex-row items-center">
              <span className="text-left ml-2 font-semibold">account id</span>
            </td>
            <td className="pl-10 py-2 text-left pr-4">
              <input type="text" className="w-full p-2 bg-ui-base border-0" value={accountID || ''} readOnly />
            </td>
          </tr>
          <tr className="bg-ui-active text-center">
            <td className="px-3 py-2 flex flex-row items-center">
              <span className="text-left ml-2 font-semibold">auth token</span>
            </td>
            <td className="pl-10 py-2 text-left pr-4">
              <textarea className="w-full p-2 bg-ui-base border-0" value={authToken || ''} readOnly />
            </td>
          </tr>
        </tbody>
      </table>

      <h2 className="mt-10 text-2xl mb-4 font-bold text-white">Using the API</h2>

      <p className="mb-4 mt-4">
        Below are the steps to explore the OnMachina API using the cURL command in your terminal.
      </p>
      <div class="p-4 mb-4  text-cyan-100 border border-cyan-800 bg-cyan-700" role="alert">
        <span class="font-medium">Note:</span> Full documentation can be found at{' '}
        <a href="https://docs.onmachina.io/" className="underline" target="_blank">
          docs.onmachina.io
        </a>
        .
      </div>
      <h3 className="mb-4 mt-8 text-white">
        1. First, you'll want to export your account ID along with your API token.
      </h3>
      <p className="mb-4 mt-4">Both values have been prepopulated for you in the following shell command:</p>
      <CodeBlock
        code={`export DSN_ACCOUNT=${accountID || ''} && export DSN_API_TOKEN=${authToken} && export OS_AUTH_TOKEN=${
          authToken || ''
        } && export OS_STORAGE_URL=https://api.global01.onmachina.io/v1/${accountID}`}
      />

      <h3 className="mb-4 mt-8 text-white">
        2. Now you can run API commands against the OnMachina distributed storage network.
      </h3>
      <p className="mb-4 mt-4">View an overview of your account:</p>
      <CodeBlock
        code={`curl -i https://api.global01.onmachina.io/v1/$DSN_ACCOUNT -X GET -H "X-Auth-Token: $DSN_API_TOKEN"`}
      />
      <p className="mb-4 mt-4">Create a new container called "test-container":</p>
      <CodeBlock
        code={`curl -i https://api.global01.onmachina.io/v1/$DSN_ACCOUNT/test-container -X PUT -H "X-Auth-Token: $DSN_API_TOKEN"`}
      />
      <p className="mb-4 mt-4">
        Add an object into the container:
        <br />
        (Be sure to include a proper content type for the data to be accessible)
      </p>
      <CodeBlock
        code={`curl -i https://api.global01.onmachina.io/v1/$DSN_ACCOUNT/test-container/test.txt -X PUT -H "X-Auth-Token: $DSN_API_TOKEN" -H "Content-Type: text/plain" -T ~/tmp`}
      />
      <h2 className="mt-10 text-2xl mb-4 font-bold text-white">Working with larger file sets</h2>
      <h3 className="mb-4 mt-8 text-white">Uploading multiple files at once</h3>
      <p className="mb-4 mt-4">
        You can upload an archive file that will be extracted automatically into multiple objects inside the container:
      </p>
      <CodeBlock
        code={`curl -i "https://api.global01.onmachina.io/v1/$DSN_ACCOUNT/container-name?extract-archive=tar.gz" -X PUT -H "X-Auth-Token: $DSN_API_TOKEN" -H "X-Detect-Content-Type: true" -T ./1000files.tar.gz`}
      />
      <h3 className="mb-4 mt-8 text-white">Deleting files in batches</h3>
      <p className="mb-4 mt-4">
        First create a text file containing the paths of the objects you want to delete, one per line.
      </p>
      <CodeBlock code={`container1/object1.txt\ncontainer2/object2.txt`} />

      <p className="mb-4 mt-4">Then, use the following command to delete the objects in the batch:</p>
      <CodeBlock
        code={`curl -i "https://api.global01.onmachina.io/v1/$DSN_ACCOUNT/" -X DELETE -H "X-Auth-Token: <TOKEN>" --data-binary ./objects_to_delete.txt`}
      />
    </div>
  );
}
