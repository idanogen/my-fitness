import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import ActiveWorkout from './pages/ActiveWorkout';
import Progress from './pages/Progress';
import Plan from './pages/Plan';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleStartWorkout = () => {
    setActiveTab('workout');
  };

  const handleFinishWorkout = () => {
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-base text-txt-primary font-body selection:bg-primary-100" dir="rtl">
      <div className="max-w-lg mx-auto">
        {activeTab === 'dashboard' && <Dashboard onStartWorkout={handleStartWorkout} />}
        {activeTab === 'workout' && <ActiveWorkout onFinish={handleFinishWorkout} />}
        {activeTab === 'progress' && <Progress />}
        {activeTab === 'plan' && <Plan />}
      </div>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
