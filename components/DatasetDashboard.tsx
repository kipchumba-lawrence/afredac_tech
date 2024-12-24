import React from 'react';
import ActivityFeed from './ActivityFeed';
import { useContractRead, useAccount } from 'wagmi';
import { abi } from '../abi/DatasetRegistry.json';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Database, Users, FileText } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
const contractAddress = '0x948e11468314753B813fE3e30765e33E6Ce5dE29';

// Modern minimalistic styles
const styles = `
  body {
    background: #f8fafc;
  }

  .modern-container {
    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    min-height: 100vh;
    padding: 2rem 0;
  }

  .modern-card {
    background: white;
    border: none !important;
    border-radius: 16px !important;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06) !important;
    transition: transform 0.2s ease;
  }

  .modern-card:hover {
    transform: translateY(-4px);
  }

  .dashboard-title {
    font-weight: 800;
    background: linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.5px;
  }

  .metric-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1a1a1a;
    line-height: 1;
    margin: 0.5rem 0;
  }

  .metric-label {
    color: #64748b;
    font-size: 0.875rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .chart-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 1.5rem;
  }

  .icon-wrapper {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    margin-bottom: 1rem;
  }

  .status-message {
    font-size: 1.125rem;
    font-weight: 500;
    color: #64748b;
  }

  .spinner-modern {
    color: #2563eb !important;
    width: 2.5rem;
    height: 2.5rem;
  }
`;

const DatasetDashboard = () => {
  const { isConnected } = useAccount();
  
  const { data: datasets, isError, isLoading } = useContractRead({
    address: contractAddress,
    abi,
    functionName: 'getAllDatasets',
  });

  const calculateMetrics = () => {
    if (!datasets) return { totalDatasets: 0, uniqueOwners: 0, categories: [] };
    
    const uniqueOwners = new Set(datasets.map(d => d.owner)).size;
    const categoryCount = datasets.reduce((acc, dataset) => {
      const category = dataset.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const categoryData = Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count,
    }));

    return {
      totalDatasets: datasets.length,
      uniqueOwners,
      categories: categoryData,
    };
  };

  const metrics = calculateMetrics();

  if (!isConnected) {
    return (
      <div className="modern-container">
        <style>{styles}</style>
        <div className="container">
          <div className="text-center">
            <h1 className="dashboard-title mb-4">Analytics</h1>
            <div className="modern-card p-5 mx-auto" style={{ maxWidth: '500px' }}>
              <div className="mb-4">
                <Database size={32} className="text-primary" />
              </div>              
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ConnectButton />
            </div>
              <p className="text-muted mb-0">Connect your wallet to access the analytics dashboard</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="modern-container">
        <style>{styles}</style>
        <div className="container">
          <div className="text-center">
            <h1 className="dashboard-title mb-4">Welcome to Afredac</h1>
            <div className="modern-card p-5 mx-auto" style={{ maxWidth: '500px' }}>
              <div className="spinner-border spinner-modern" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="status-message mt-3 mb-0">Loading analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="modern-container">
        <style>{styles}</style>
        <div className="container">
          <div className="text-center">
            <h1 className="dashboard-title mb-4">Afredac</h1>
            <div className="modern-card p-5 mx-auto" style={{ maxWidth: '500px' }}>
              <h5 className="mb-3 fw-semibold">Unable to load data</h5>
              <p className="text-muted mb-0">Please try refreshing the page</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-container">
      <style>{styles}</style>
      <div className="container">
        <h1 className="dashboard-title mb-5">Afredac</h1>
        <span className='h4'>What would you like to do today?</span>
        
        {/* Summary Cards */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="modern-card h-100">
              <div className="card-body p-4">
                <div className="icon-wrapper bg-primary bg-opacity-10">
                  <Database className="text-primary" size={24} />
                </div>
                <div className="metric-value">{metrics.totalDatasets}</div>
                <div className="metric-label">Total Datasets</div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="modern-card h-100">
              <div className="card-body p-4">
                <div className="icon-wrapper bg-success bg-opacity-10">
                  <Users className="text-success" size={24} />
                </div>
                <div className="metric-value">{metrics.uniqueOwners}</div>
                <div className="metric-label">Contributors</div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="modern-card h-100">
              <div className="card-body p-4">
                <div className="icon-wrapper bg-info bg-opacity-10">
                  <FileText className="text-info" size={24} />
                </div>
                <div className="metric-value">{metrics.categories.length}</div>
                <div className="metric-label">Categories</div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="modern-card h-100">
              <div className="card-body p-4">
                <h3 className="chart-title">Activity Feed</h3>
                <ActivityFeed />
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="modern-card">
              <div className="card-body p-4">
                <h3 className="chart-title">Dataset Distribution</h3>
                <div style={{ height: "400px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={metrics.categories}
                        dataKey="count"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        label={({ name, percent }) => 
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {metrics.categories.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`}
                            fill={[
                              '#2563eb', // primary
                              '#10b981', // success
                              '#6366f1', // indigo
                              '#f59e0b', // warning
                              '#ef4444', // danger
                              '#06b6d4', // cyan
                            ][index % 6]}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          background: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="modern-card mt-4">
              <div className="card-body p-4">
                <h3 className="chart-title">Dataset Distribution</h3>
                <div style={{ height: "400px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics.categories} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="category" 
                        angle={-45} 
                        textAnchor="end" 
                        height={60} 
                        interval={0}
                        tick={{ fill: '#64748b' }}
                      />
                      <YAxis 
                        label={{ 
                          value: 'Datasets', 
                          angle: -90, 
                          position: 'insideLeft',
                          style: { fill: '#64748b' }
                        }}
                        tick={{ fill: '#64748b' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          background: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="#2563eb"
                        name="Datasets"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetDashboard;