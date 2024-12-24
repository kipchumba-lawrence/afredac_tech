import React, { useEffect, useState } from 'react';
import { useContractRead, useAccount } from 'wagmi';
import { abi } from '../abi/DatasetRegistry.json';
import { Clock, Database, User, Tag } from 'lucide-react';

// Type definitions
interface Dataset {
  cid: string;
  name: string;
  category: string;
  owner: string;
}

interface ContractData extends Array<Dataset> {}

const contractAddress = '0x948e11468314753B813fE3e30765e33E6Ce5dE29' as const;

const ActivityFeed: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [activities, setActivities] = useState<Dataset[]>([]);

  const { data, isError, isLoading } = useContractRead({
    address: contractAddress,
    abi,
    functionName: 'getAllDatasets',
  }) as { data: ContractData | undefined; isError: boolean; isLoading: boolean };

  useEffect(() => {
    if (data) {
      // Only display the 7 most recent uploads
      setActivities(data.slice(-7).reverse());
    }
  }, [data]);

  const truncateAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isLoading) return (
    <div className="d-flex justify-content-center p-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (isError) return (
    <div className="alert alert-danger text-center" role="alert">
      Error loading activity feed.
    </div>
  );

  return (
    <div className="container mt-4">      
      {!isConnected ? (
        <div className="alert alert-warning text-center" role="alert">
          Please connect your wallet to view the activity feed.
        </div>
      ) : (
        <div className="list-group">
          {activities.map((activity: Dataset, index: number) => (
            <div className="list-group-item list-group-item-action rounded m-2" key={index}>
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-1">{activity.name}</h6>
                <small className="text-muted">{truncateAddress(activity.owner)}</small>
              </div>
              <p className="mb-1">
                <Tag className="me-2 text-muted" />
                {activity.category}
              </p>
              <small className="text-muted">
                <Clock className="me-2" />
                CID: {activity.cid.slice(0, 15)}...
              </small>
              <div className="mt-2">
                {/* <a
                  href={`https://${activity.cid}.ipfs.w3s.link/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary"
                >
                  View Dataset →
                </a> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
