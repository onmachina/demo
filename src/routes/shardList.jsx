import ShardCard from '../components/ShardCard';

export default function ShardList() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold">Available Shards</h1>
      <div className="flex flex-row space-x-4 mt-4">
        <ShardCard
          name="testnet.omnachina"
          decsription="The current test cluster for the OnMachina platform."
          url="/"
          isActive={true}
        />
        <ShardCard
          name="global01.omnachina"
          decsription="Global production cluster for the OnMachina platform"
          url="/"
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
