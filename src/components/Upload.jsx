import { useParams, Link } from 'react-router-dom';

export default function Upload({authKey}) {
    
    let { container } = useParams();
    
    return (
        <div className="container mx-auto border border-cyan-300 bg-cyan-100 p-5 mb-5">
            <h2>Upload to {container}</h2>
            <form>
                <input type="file" />
            </form>
            <p>Creds: {authKey}</p>
            <Link to={`/${container}`}>Close</Link>
        </div>
    )
}