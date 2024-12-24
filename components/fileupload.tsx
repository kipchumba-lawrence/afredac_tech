import React, { useState, useCallback } from 'react';
import * as Client from '@web3-storage/w3up-client';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = useCallback(async () => {
    if (!file) {
      setUploadStatus('Please select a file first.');
      return;
    }

    try {
      setUploadStatus('Initializing client...');
      const client = await Client.create();

      if (!Object.keys(client.accounts()).length) {
        setUploadStatus('Logging in...');
        const account = await client.login('biwotlawrence@gmail.com');
        const space = await client.createSpace('lets-go');
        await space.save();
        await account.provision(space.did());
      }

      setUploadStatus('Uploading file...');
      const cid = await client.uploadFile(file);
      setUploadStatus(`File uploaded successfully! CID: https://${cid}.ipfs.w3s.link/`);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus(`Error uploading file: ${error.message}`);
    }
  }, [file]);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Upload File to Web3.Storage</h2>
      <input 
        type="file" 
        onChange={handleFileChange} 
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <button 
        onClick={uploadFile} 
        className="btn btn-primary btn-sm form-control"
      >
        Upload
      </button>
      {uploadStatus && (
        <p className="mt-4 text-sm text-gray-600">{uploadStatus}</p>
      )}
    </div>
  );
};

export default FileUpload;