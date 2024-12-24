import React, { useEffect, useState } from 'react';
import { useContractRead, useAccount } from 'wagmi';
import { abi } from '../abi/DatasetRegistry.json';
import styles from '../src/styles/storage.module.css';

interface Dataset {
  cid: string;
  name: string;
  category: string;
  owner: string;
}

interface ContractData extends Array<Dataset> {}

const contractAddress = '0x948e11468314753B813fE3e30765e33E6Ce5dE29' as const;

const RetrieveUserDatasets: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [userDatasets, setUserDatasets] = useState<Dataset[]>([]);

  const { data, isError, isLoading } = useContractRead({
    address: contractAddress,
    abi,
    functionName: 'getAllDatasets',
  }) as { data: ContractData | undefined; isError: boolean; isLoading: boolean };

  useEffect(() => {
    if (data && address) {
      // Filter datasets to only show those owned by the connected user
      const filteredDatasets = data.filter(
        (dataset) => dataset.owner.toLowerCase() === address.toLowerCase()
      );
      setUserDatasets(filteredDatasets);
    }
  }, [data, address]);

  const handleDatasetClick = (cid: string): void => {
    window.open(`https://${cid}.ipfs.w3s.link/`, '_blank');
  };

  if (!isConnected) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          Please connect your wallet to view your datasets.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Error loading your datasets. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className={`container mt-5 ${styles.container}`}>
      <h1 className={styles.heading}>Your Uploaded Datasets</h1>
      {userDatasets.length === 0 ? (
        <div className="alert alert-info">
          You haven't uploaded any datasets yet.
        </div>
      ) : (
        <div className="row">
          {userDatasets.map((dataset: Dataset, index: number) => (
            <div className="col-md-3 mb-4" key={index}>
              <div
                className={`card ${styles.datasetCard}`}
                onClick={() => handleDatasetClick(dataset.cid)}
              >
                <div className="card-body">
                  <h5 className="card-title">{dataset.name}</h5>
                  <p className="card-text">
                    <strong>Category:</strong> {dataset.category}
                  </p>
                  <div className="mt-3">
                    <a
                      href={`https://${dataset.cid}.ipfs.w3s.link/`}
                      target="_blank"
                      className="btn btn-primary me-2"
                      rel="noopener noreferrer"
                    >
                      Download Dataset
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RetrieveUserDatasets;