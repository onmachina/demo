import { HiOutlineDocument, HiOutlineTrash } from 'react-icons/hi2';
import { formatDate } from '../../../lib/utils.js';
import { formatFileSize } from '../../../lib/utils.js';
import { Link } from 'react-router-dom';

export default function ObjectTable({ objects, selectedObject }) {
  return (
    <table className="min-w-full table-auto text-ui-base">
      <thead>
        <tr className="bg-ui-base font-normal">
          <th className="px-16 py-2 rounded-tl-md">
            <span className="text-ui-muted font-normal">File Name</span>
          </th>
          <th className="px-16 py-2">
            <span className="text-ui-muted font-normal">Date Modified</span>
          </th>
          <th className="px-16 py-2">
            <span className="text-ui-muted font-normal">Size</span>
          </th>
          <th className="px-16 py-2">
            <span className="text-ui-muted font-normal">Type</span>
          </th>
          <th className="px-16 py-2 rounded-tr-md"></th>
        </tr>
      </thead>
      <tbody>
        {objects.map((object, index) => {
          const selected = object.name === selectedObject;
          return <Row {...object} key={index} selected={selected} />;
        })}
      </tbody>
    </table>
  );
}

function Row({ last_modified, bytes, name, content_type, selected }) {
  let selectedClass = selected ? 'bg-ui-selected' : 'bg-ui-base hover:bg-ui-active';

  return (
    <tr className={`text-center ${selectedClass}`}>
      <td className="px-3 py-2 flex flex-row items-center">
        <Link to={`${name}/`}>
          <HiOutlineDocument size={22} className="text-ui-icon" />
        </Link>
        <Link to={`${name}/`}>
          <span className="text-center ml-2 font-semibold">{name || 'Unknown'}</span>
        </Link>
      </td>
      <td className="pl-10 py-2">
        <span>{formatDate(last_modified)}</span>
      </td>
      <td className="pl-10 py-2">
        <span>{formatFileSize(bytes) || '0'}</span>
      </td>
      <td className="pl-10 py-2">
        <span>{content_type || 'Unknown'}</span>
      </td>
      <td className="text-right pr-4 text-red-600">
        <Link to={`?action=delete&object=${name}`}>
          <HiOutlineTrash size={22} className="inline-block" />
        </Link>
      </td>
    </tr>
  );
}
``;
