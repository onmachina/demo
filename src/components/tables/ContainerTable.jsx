import { HiOutlineCube, HiOutlineTrash } from 'react-icons/hi2';
import { formatDate } from '../../../lib/utils.js';
import { formatFileSize } from '../../../lib/utils.js';
import { Link } from 'react-router-dom';

export default function ContainerTable({ containers }) {
  return (
    <table className="min-w-full table-auto">
      <thead>
        <tr className="bg-ui-base font-normal">
          <th className="px-16 py-2 rounded-tl-md">
            <span className="text-ui-muted font-normal">Container</span>
          </th>
          <th className="px-16 py-2">
            <span className="text-ui-muted font-normal">Date Modified</span>
          </th>
          <th className="px-16 py-2">
            <span className="text-ui-muted font-normal">Size</span>
          </th>
          <th className="px-16 py-2">
            <span className="text-ui-muted font-normal">Number of objects</span>
          </th>
          <th className="px-16 py-2 rounded-tr-md"></th>
        </tr>
      </thead>
      <tbody>
        {containers.map((container, index) => {
          // const selected = object.name === selectedObject;
          const selected = false;
          return <Row {...container} key={index} selected={selected} />;
        })}
      </tbody>
    </table>
  );
}

function Row({ last_modified, bytes, name, count, selected }) {
  let selectedClass = selected ? 'bg-cyan-100' : 'bg-ui-base hover:bg-ui-active';

  return (
    <tr className={`text-center ${selectedClass}`}>
      <td className="px-3 py-2 flex flex-row items-center">
        <Link className="text-sky-400" to={`${name}/`}>
          <HiOutlineCube size={22} />
        </Link>
        <Link to={`${name}/`}>
          <span className="text-center ml-2 text-ui-base">{name || 'Unknown'}</span>
        </Link>
      </td>
      <td className="pl-10 py-2 text-ui-base">
        <span>{formatDate(last_modified)}</span>
      </td>
      <td className="pl-10 py-2 text-ui-base">
        <span>{formatFileSize(bytes) || '0'}</span>
      </td>
      <td className="pl-10 py-2 text-ui-base">
        <span>{count || '0'}</span>
      </td>
      <td className="text-right pr-4 text-red-600">
        <Link to={`/?action=delete&container=${name}`}>
          <HiOutlineTrash size={22} className="inline-block" />
        </Link>
      </td>
    </tr>
  );
}
