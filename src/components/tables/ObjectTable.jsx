import { HiOutlineDocument, HiOutlineTrash } from 'react-icons/hi2';
import { formatDate } from '../../../lib/utils.js';
import { formatFileSize } from '../../../lib/utils.js';
import { Link } from 'react-router-dom';

export default function ObjectTable({ objects, selectedObject }) {
  return (
    <table className="object-table min-w-full table-fixed text-ui-base border-t border-ui-base">
      <thead>
        <tr className="bg-ui-base font-normal">
          <th className="pr-2 py-2">
            <span className="text-ui-muted font-normal">File Name</span>
          </th>
          <th className="pr-2 py-2 w-[15rem]">
            <span className="text-ui-muted font-normal">Date Modified</span>
          </th>
          <th className="pr-2 py-2 w-[9rem]">
            <span className="text-ui-muted font-normal">Size</span>
          </th>
          <th className="pr-2 py-2 w-[9rem]">
            <span className="text-ui-muted font-normal">Type</span>
          </th>
          <th className="pr-2 py-2 w-[2rem]"></th>
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
  let selectedClass = selected ? 'bg-ui-selected text-black' : 'bg-ui-base hover:bg-ui-active';

  return (
    <tr className={`text-center ${selectedClass}`}>
      <td className="px-2 py-2 flex flex-row items-center">
        <Link to={`${name}/`}>
          <HiOutlineDocument size={22} className="text-ui-icon" />
        </Link>
        <Link to={`${name}/`}>
          <span className="text-center ml-2 font-semibold">{name || 'Unknown'}</span>
        </Link>
      </td>
      <td className="pr-2 py-2">
        <span>{formatDate(last_modified)}</span>
      </td>
      <td className="pr-2 py-2">
        <span>{formatFileSize(bytes) || '0'}</span>
      </td>
      <td className="pr-2 py-2">
        <span>{content_type || 'Unknown'}</span>
      </td>
      <td className="text-right pr-2 text-red-600">
        <Link to={`?action=delete-object&object=${name}`}>
          <HiOutlineTrash size={22} className="inline-block" />
        </Link>
      </td>
    </tr>
  );
}
``;
