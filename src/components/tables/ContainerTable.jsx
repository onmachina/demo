import { HiOutlineCube, HiOutlineTrash } from 'react-icons/hi2';
import { formatDate } from '../../../lib/utils.js';
import { formatFileSize } from '../../../lib/utils.js';
import { Link } from 'react-router-dom';
import './tables.css';

export default function ContainerTable({ containers, selectedContainer }) {
  return (
    <table className="container-table min-w-full table-fixed text-ui-base border-t border-ui-base">
      <thead>
        <tr className="bg-ui-base font-normal">
          <th className="pr-2 py-2">
            <span className="text-ui-muted font-normal">Container</span>
          </th>
          <th className="pr-2 py-2 w-[15em]">
            <span className="text-ui-muted font-normal">Date Modified</span>
          </th>
          <th className="pr-2 py-2 w-[9em]">
            <span className="text-ui-muted font-normal">Size</span>
          </th>
          <th className="pr-2 py-2 w-[9rem]">
            <span className="text-ui-muted font-normal">Objects</span>
          </th>
          <th className="pr-2 py-2 w-[2em]"></th>
        </tr>
      </thead>
      <tbody>
        {containers.map((container, index) => {
          const selected = container?.name === selectedContainer;
          return <Row {...container} key={index} selected={selected} />;
        })}
      </tbody>
    </table>
  );
}

function Row({ last_modified, bytes, name, count, selected }) {
  let selectedClass = selected ? 'bg-ui-active' : 'bg-ui-base hover:bg-ui-active';

  return (
    <tr className={`text-center ${selectedClass}`}>
      <td className="px-3 py-2 flex flex-row items-center whitespace-nowrap">
        <Link className="text-sky-400" to={`${name}/`}>
          <HiOutlineCube size={22} />
        </Link>
        <Link to={`${name}/`}>
          <span className="text-center ml-2 text-ui-base">{name || 'Unknown'}</span>
        </Link>
      </td>
      <td className="pl-10 py-2 text-ui-base whitespace-nowrap">
        <span>{formatDate(last_modified)}</span>
      </td>
      <td className="pl-10 py-2 text-ui-base whitespace-nowrap">
        <span>{formatFileSize(bytes) || '0'}</span>
      </td>
      <td className="pl-10 py-2 text-ui-base w-auto whitespace-nowrap">
        <span>{count || '0'}</span>
      </td>
      <td className="text-right pr-4 text-red-600 w-auto">
        <Link to={`/?action=delete&container=${name}`}>
          <HiOutlineTrash size={22} className="inline-block" />
        </Link>
      </td>
    </tr>
  );
}
