export default function FileIcon({ type }) {
  return (
    <div className="w-full h-[200px] flex items-center justify-center">
      <div>
        <div className="rounded-lg shadow-lg aspect-square w-24 mx-auto bg-white text-sm text-white py-2 px-4 relative">
          <div className="absolute bottom-2 -right-3 rounded-md border-b border-blue-700 bg-blue-200 text-sm text-slate-600 py-1 px-3 scale-90">
            {type}
          </div>
        </div>
      </div>
    </div>
  );
}
