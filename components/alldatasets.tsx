import React, { useEffect, useState } from 'react';
import { useContractRead, useAccount } from 'wagmi';
import { abi } from '../abi/DatasetRegistry.json';
import styles from '../src/styles/storage.module.css';

// Type definitions
interface Dataset {
  cid: string;
  name: string;
  category: string;
  owner: string;
}

interface ContractData extends Array<Dataset> {}

const contractAddress = '0x948e11468314753B813fE3e30765e33E6Ce5dE29' as const;

const RetrieveDatasets: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [datasets, setDatasets] = useState<Dataset[]>([]);

  const { data, isError, isLoading } = useContractRead({
    address: contractAddress,
    abi,
    functionName: 'getAllDatasets',
    // watch: true, // Automatically refresh data
  }) as { data: ContractData | undefined; isError: boolean; isLoading: boolean };

  useEffect(() => {
    if (data) {
      console.log(data);
      setDatasets(data);
    }
  }, [data]);

  const handleDatasetClick = (cid: string): void => {
    window.open(`https://${cid}.ipfs.w3s.link/`, '_blank');
  };

  if (isLoading) return <p>Loading datasets...</p>;
  if (isError) return <p>Error loading datasets.</p>;

  return (
    <div className={`container mt-5 ${styles.container}`}>
      <h1 className={styles.heading}>Available Datasets</h1>
      {isConnected ? (
        <div className="row">
          {datasets.map((dataset: Dataset, index: number) => (
            <div className="col-md-3 mb-4" key={index}>
              <div
                className={`card ${styles.datasetCard}`}
                // onClick={() => handleDatasetClick(dataset.cid)}
              >
                <div className="card-body">
                  <h5 className="card-title">{dataset.name}</h5>
                  <p className="card-text">
                    <strong>Category:</strong> {dataset.category}
                  </p>
                  <p className="card-text">
                    <strong>Owner:</strong> {dataset.owner}
                  </p>
                  {/* <a
                    href={`https://${dataset.cid}.ipfs.w3s.link/`}
                    target="_blank"
                    className="btn btn-primary"
                    rel="noopener noreferrer"
                  >
                    Download Dataset
                  </a> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Please connect your wallet.</p>
      )}
    </div>
  );
};

export default RetrieveDatasets;