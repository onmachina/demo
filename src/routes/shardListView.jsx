import ShardCard from '../components/ShardCard';

export default function ShardListView() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-white">Available Shards</h1>
      <div className="flex flex-row space-x-4 mt-4">
        <ShardCard
          name="global01.onmachina"
          decsription="Global production cluster for the OnMachina platform"
          url="/"
          isActive={true}
        />
        <ShardCard
          name="eu01.onmachina"
          decsription="Europe-based shard supporting geo-fenced regional storage"
          url="/"
        />
      </div>
    </div>
  );
}
