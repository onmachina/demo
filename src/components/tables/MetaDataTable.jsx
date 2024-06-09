export default function MetaDataTable({ metadata }) {
  if (!metadata) return <></>;

  return (
    <table className="min-w-full table-auto mt-8 text-sm">
      <thead>
        <tr>
          <th className="sr-only">
            <span className="text-ui-muted">Name</span>
          </th>
          <th className="sr-only">
            <span className="text-ui-muted">Value</span>
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
    <tr className="bg-ui-base text-ui-muted text-center">
      <td className="px-2 py-2 text-right">{name}</td>
      <td className="pl-4 py-2 text-left text-ui-base">{value}</td>
    </tr>
  );
}
