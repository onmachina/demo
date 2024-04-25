import { useRouteLoaderData } from 'react-router-dom';

import CodeBlock from '../components/CodeBlock';

export default function SettingsPage() {
  const { username, token } = useRouteLoaderData('root');

  return (
    <div className="container ml-8 max-w-2xl">
      <h1 className="text-3xl mb-4 font-bold">Account Settings</h1>

      <div class="p-4 mb-4  rounded-lg border border-cyan-300 bg-cyan-100" role="alert">
        <span class="font-medium">Note:</span> Your API key from OnMachina will change and need to be refreshed about
        once every two hours. On this page, you can see your current API key.
      </div>

      <table class="min-w-full table-auto mt-8">
        <thead>
          <tr>
            <th class="sr-only">
              <span class="text-gray-400">Name</span>
            </th>
            <th class="sr-only">
              <span class="text-gray-400">Value</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-gray-50 text-center">
            <td className="px-3 py-2 flex flex-row items-center">
              <span className="text-left ml-2 font-semibold">account id</span>
            </td>
            <td className="pl-10 py-2 text-left pr-4">
              <input type="text" className="w-full p-2 border" value={username} />
            </td>
          </tr>
          <tr className="bg-gray-50 text-center">
            <td className="px-3 py-2 flex flex-row items-center">
              <span className="text-left ml-2 font-semibold">auth token</span>
            </td>
            <td className="pl-10 py-2 text-left pr-4">
              <textarea className="w-full p-2 border">{token}</textarea>
            </td>
          </tr>
        </tbody>
      </table>

      <h2 className="mt-10 text-2xl mb-4 font-bold">💻 Using the API</h2>

      <p className="mb-4 mt-4">
        Below are the steps to explore the OnMachina API using the cURL command in your terminal.
      </p>
      <div class="p-4 mb-4  rounded-lg border border-cyan-300 bg-cyan-100" role="alert">
        <span class="font-medium">Note:</span> Full docmentation can be found at{' '}
        <a href="https://docs.onmachina.io/" className="underline" target="_blank">
          docs.onmachina.io
        </a>
        .
      </div>
      <h3 className="mb-4 mt-8 font-bold">
        1. First, you'll want to export your account ID along with your API token.
      </h3>
      <p className="mb-4 mt-4">Both values have been prepopulated for you in the following shell command:</p>
      <CodeBlock code={`export DSN_ACCOUNT=${username} && export DSN_API_TOKEN=${token}`} />

      <p className="mb-4 mt-8 font-bold">
        2. Now you can run API commands against the OnMachina distributed storage network.
      </p>
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
    </div>
  );
}
