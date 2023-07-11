import { useRef } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import MetaDataTable from '../components/tables/MetaDataTable';
import UseEscape from '../hooks/useEscape';
import { HiOutlinePencilSquare, HiOutlineArrowDownTray, HiOutlineTrash, HiXMark } from 'react-icons/hi2';
import useOnClickOutside from '../hooks/useOnClickOutside';
import ObjectPreview from './ObjectPreview';

export default function DisplayObject({ accountId, authKey, objectData, container, object, setMode }) {
  const [mode, setMode] = useState('display');

  let { container, object } = useParams();
  const objectData = useLoaderData();

  let Component;
  switch (mode) {
    case 'delete':
      Component = DeleteComponent;
      break;
    case 'rename':
      Component = RenameComponent;
      break;
    default:
      Component = DisplayObject;
  }

  const navigate = useNavigate();
  const ref = useRef();
  useOnClickOutside(ref, () => navigate(`/${container}`));

  UseEscape(() => {
    navigate(`/${container}`);
  });

  return (
    <>
      <div className="w-2/4 right-0 top-0 h-full absolute z-10 p-4 ui-panel" ref={ref}>
        <Outlet />
        <div className="p-5 mb-5 w-full bg-ui-base border border-ui-base rounded-lg shadow-lg text-ui-muted">
          <h2 className="border-b pb-2 mb-2 border-ui-base flex justify-between">
            <div>
              Details for <strong>{object}</strong>
            </div>
            <Link to={`/${container}`}>
              <HiXMark />
            </Link>
          </h2>
          <ObjectPreview
            accountId={accountId}
            authKey={authKey}
            objectData={objectData}
            container={container}
            object={object}
          />
          <div className="text-ui-active text-center">{object}</div>
          <Suspense fallback={<div>Loading...</div>}>
            <Component
              accountId={accountId}
              authKey={authKey}
              objectData={objectData}
              container={container}
              object={object}
              setMode={setMode}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}
