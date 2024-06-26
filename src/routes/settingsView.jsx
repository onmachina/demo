import { useEffect, useState } from 'react';
import CodeBlock from '../components/CodeBlock';
import { auth0AuthProvider } from '../../lib/auth';

export default function SettingsView() {
  const [accountID, setAccountId] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = await auth0AuthProvider.accessToken();
        const accountID = await auth0AuthProvider.email();
        setAccountId(accountID);
        setAuthToken(authToken);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [accountID, authToken]);

  return (
    <div className="container ml-8 max-w-2xl text-slate-400">
      <h1 className="text-3xl mb-4 font-bold text-white">Account Settings</h1>

      <div class="p-4 mb-4  text-cyan-100 border border-cyan-800 bg-cyan-700" role="alert">
        <span class="font-medium">Note:</span> Your API key from OnMachina will change and need to be refreshed about
        once every two hours. On this page, you can see your current API key.
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
        <span class="font-medium">Note:</span> Full docmentation can be found at{' '}
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
        code={`export NEAR_ACCOUNT=${accountID || ''} && export DSN_API_TOKEN=${authToken} && export OS_AUTH_TOKEN=${
          authToken || ''
        } && export OS_STORAGE_URL=https://api.global01.onmachina.io/v1/${accountID}`}
      />

      <p className="mb-4 mt-8 text-white">
        2. Now you can run API commands against the OnMachina distributed storage network.
      </p>
      <p className="mb-4 mt-4">View an overview of your account:</p>
      <CodeBlock
        code={`curl -i https://api.global01.onmachina.io/v1/$NEAR_ACCOUNT -X GET -H "X-Auth-Token: $DSN_API_TOKEN"`}
      />
      <p className="mb-4 mt-4">Create a new container called "test-container":</p>
      <CodeBlock
        code={`curl -i https://api.global01.onmachina.io/v1/$NEAR_ACCOUNT/test-container -X PUT -H "X-Auth-Token: $DSN_API_TOKEN"`}
      />
      <p className="mb-4 mt-4">
        Add an object into the container:
        <br />
        (Be sure to include a proper content type for the data to be accessible)
      </p>
      <CodeBlock
        code={`curl -i https://api.global01.onmachina.io/v1/$NEAR_ACCOUNT/test-container/test.txt -X PUT -H "X-Auth-Token: $DSN_API_TOKEN" -H "Content-Type: text/plain" -T ~/tmp`}
      />
    </div>
  );
}
