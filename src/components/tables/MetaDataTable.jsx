export default function MetaDataTable({ metadata }) {
  if (!metadata) return <></>;

  return (
    <table className="min-w-full table-auto">
      <thead>
        <tr>
          <th className="px-16 py-2">
            <span className="text-gray-400">Name</span>
          </th>
          <th className="px-16 py-2">
            <span className="text-gray-400">Value</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {metadata.map((item, index) => (
          <Row {...item} key={index} />
        ))}
      </tbody>
    </table>
  );
}

function Row({ name, value }) {
  return (
    <tr className="bg-gray-50 text-center">
      <td className="px-3 py-2 flex flex-row items-center">
        <span className="text-left ml-2 font-semibold">{name}</span>
      </td>
      <td className="pl-10 py-2 text-left">
        <span>{value}</span>
      </td>
    </tr>
  );
}
