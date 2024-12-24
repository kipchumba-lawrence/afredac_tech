import React, { useState, useEffect, useCallback } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import * as Client from '@web3-storage/w3up-client';
import { abi } from '../abi/DatasetRegistry.json';

const contractAddress = '0x948e11468314753B813fE3e30765e33E6Ce5dE29';

const DatasetForm = () => {
  const { address, isConnected } = useAccount();
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [cid, setCid] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { writeContract, isSuccess, isError, error } = useWriteContract();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setFile(files[0]);
    }
  };

  const uploadFile = useCallback(async () => {
    if (!file) {
      setUploadStatus('Please select a file first.');
      return;
    }
  
    try {
      setUploadStatus('Initializing client...');
      const client = await Client.create();
      await client.login('biwotlawrence@gmail.com');
  
      setUploadStatus('Fetching spaces...');
      const spaces = await client.spaces();
      console.log('Available spaces:', spaces);
  
      const afredacSpace = spaces.find(space => space.name === 'afredac');
  
      if (!afredacSpace) {
        throw new Error('Space "afredac" not found. Please make sure it exists in your account.');
      }
  
      setUploadStatus('Setting current space...');
      await client.setCurrentSpace(afredacSpace.did());
  
      setUploadStatus('Uploading file to "afredac" space...');
      const uploadResult = await client.uploadFile(file);
      console.log('Upload result:', uploadResult);
  
      if (!uploadResult) {
        throw new Error('File upload failed. CID is missing.');
      }
  
      const fileCid = uploadResult.toString();
      setCid(fileCid);
      setUploadStatus(`File uploaded successfully! CID: ${fileCid}`);
      return fileCid;
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus(`Error uploading file: ${error.message}`);
      throw error;
    }
  }, [file]);
  

  const handleSubmit = async (event : React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    try {
      const uploadedCid = await uploadFile();
      const dateCreated = Math.floor(Date.now() / 1000);

      writeContract({
        address: contractAddress,
        abi,
        functionName: 'addDataset',
        args: [name, category, uploadedCid],
      });
    } catch (error) {
      console.error('Error during submission:', error);
      setUploadStatus(`Error during submission: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Dataset Submission</h1>
      {isConnected ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dataset Name"
              required
            />
          </div>
          <div className="mb-3">
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              <option value="diagnosis">Diagnosis</option>
              <option value="treatment">Treatment</option>
              <option value="symptoms">Symptoms</option>
              <option value="population_health">Population Health</option>
              <option value="clinical_trials">Clinical Trials</option>
              <option value="genomics">Genomics</option>
              <option value="proteomics">Proteomics</option>
            </select>
          </div>
          <div className="mb-3">
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Dataset'}
          </button>
        </form>
      ) : (
        <p>Please connect your wallet.</p>
      )}
      {uploadStatus && (
        <div className="alert alert-info mt-3">
          {uploadStatus}
        </div>
      )}
      {isSuccess && (
        <div className="alert alert-success mt-3">
          Dataset submission successful!
        </div>
      )}
      {isError && (
        <div className="alert alert-danger mt-3">
          Error: {error?.message}
        </div>
      )}
    </div>
  );
};

export default DatasetForm;