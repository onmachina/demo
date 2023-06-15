import NearLogo from '../assets/near-logo.png';
import { Link } from 'react-router-dom';

export default function AccountBar({ wallet, accountId }) {
  return (
    <div className="pt-2 flex justify-end w-full text-ui-muted mb-2">
      <div className="flex items-center space-x-4 mr-4">
        <div className="font-medium">
          <div className="text-right">
            <Link to="/account/">{accountId}</Link>
          </div>
        </div>
        <Link to="/account/">
          <img className="w-10 h-10 rounded-full" src={NearLogo} alt="" />
        </Link>
      </div>
    </div>
  );
}
