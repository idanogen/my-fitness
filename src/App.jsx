import React, { useState, Component } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import ActiveWorkout from './pages/ActiveWorkout';
import Progress from './pages/Progress';
import Plan from './pages/Plan';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div dir="rtl" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Rubik, sans-serif', background: '#F5F7FA', padding: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>😵</div>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: '#1A1D26' }}>משהו השתבש</h1>
            <p style={{ fontSize: 16, color: '#8E95A9', marginBottom: 20 }}>נסה לרענן את הדף</p>
            <button
              onClick={() => window.location.reload()}
              style={{ background: '#FF6B4A', color: 'white', border: 'none', padding: '12px 32px', borderRadius: 16, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}
            >
              רענן
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleStartWorkout = () => {
    setActiveTab('workout');
  };

  const handleFinishWorkout = () => {
    setActiveTab('dashboard');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-base text-txt-primary font-body selection:bg-primary-100" dir="rtl">
        <div className="max-w-lg mx-auto">
          {activeTab === 'dashboard' && <Dashboard onStartWorkout={handleStartWorkout} />}
          {activeTab === 'workout' && <ActiveWorkout onFinish={handleFinishWorkout} />}
          {activeTab === 'progress' && <Progress />}
          {activeTab === 'plan' && <Plan />}
        </div>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </ErrorBoundary>
  );
}
