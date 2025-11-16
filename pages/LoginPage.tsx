import React, { useState } from 'react';
import type { Donor } from '../types';
import { Icon } from '../components/Icon';
import { DonorProfileForm } from '../components/DonorProfileForm';

type UserRole = 'manager' | 'donor';

interface LoginPageProps {
    donors: Donor[];
    onLogin: (role: UserRole, id: string, password?: string) => void;
    onCreateDonor: (donorData: Omit<Donor, 'id'>) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ donors, onLogin, onCreateDonor }) => {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
    const [loginAs, setLoginAs] = useState<UserRole>('donor');
    
    // Donor login state
    const [selectedDonorId, setSelectedDonorId] = useState<string>(donors[0]?.id || '');

    // Manager login state
    const [managerEmail, setManagerEmail] = useState('zaeem.ahmad@sabr.org');
    const [managerPassword, setManagerPassword] = useState('password'); // mock password

    const handleDonorLogin = () => {
        if (selectedDonorId) {
            onLogin('donor', selectedDonorId);
        }
    };

    const handleManagerLogin = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin('manager', managerEmail, managerPassword);
    };

    const LoginForm = () => (
        <>
             <div className="p-1.5 bg-gray-900/50 rounded-lg flex space-x-1.5 mb-6">
                <button 
                    onClick={() => setLoginAs('donor')} 
                    className={`flex-1 py-2.5 text-center font-semibold rounded-md transition-all duration-300 text-sm ${loginAs === 'donor' ? 'bg-blue-600 shadow-md shadow-blue-600/20 text-white' : 'text-gray-400 hover:bg-white/5'}`}
                >
                    Donor Portal
                </button>
                <button 
                    onClick={() => setLoginAs('manager')} 
                    className={`flex-1 py-2.5 text-center font-semibold rounded-md transition-all duration-300 text-sm ${loginAs === 'manager' ? 'bg-blue-600 shadow-md shadow-blue-600/20 text-white' : 'text-gray-400 hover:bg-white/5'}`}
                >
                    Manager Dashboard
                </button>
            </div>
            
            {loginAs === 'donor' ? (
                <div className="space-y-6 animate-page-fade-in">
                    <h3 className="text-xl font-semibold text-center text-white">Welcome, Valued Donor!</h3>
                    <div>
                        <label htmlFor="donor-select" className="block text-sm font-medium text-gray-400 mb-1">Select Your Profile</label>
                        <select
                            id="donor-select"
                            value={selectedDonorId}
                            onChange={(e) => setSelectedDonorId(e.target.value)}
                            className="w-full py-2 px-3 text-gray-300 bg-gray-900/50 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                        >
                            {donors.map(donor => <option key={donor.id} value={donor.id}>{donor.name}</option>)}
                        </select>
                    </div>
                    <button 
                        onClick={handleDonorLogin} 
                        disabled={!selectedDonorId} 
                        className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-105 shadow-lg shadow-blue-500/30 text-white font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:scale-100"
                    >
                        <Icon icon="portal" className="w-5 h-5 mr-2" title="Login" />
                        Access Portal
                    </button>
                </div>
            ) : (
                <form onSubmit={handleManagerLogin} className="space-y-6 animate-page-fade-in">
                    <h3 className="text-xl font-semibold text-center text-white">Manager Access</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                        <input type="email" value={managerEmail} onChange={e => setManagerEmail(e.target.value)} className="w-full py-2 px-3 text-gray-300 bg-gray-900/50 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                        <input type="password" value={managerPassword} onChange={e => setManagerPassword(e.target.value)} className="w-full py-2 px-3 text-gray-300 bg-gray-900/50 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all" />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-105 shadow-lg shadow-blue-500/30 text-white font-bold text-lg transition-all duration-300"
                    >
                        <Icon icon="dashboard" className="w-5 h-5 mr-2" title="Login" />
                        Login
                    </button>
                </form>
            )}
        </>
    );

    const SignUpForm = () => (
         <div className="animate-page-fade-in">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white">Join Our Network</h1>
                <p className="text-gray-400 mt-1">Register as a donor to start making an impact.</p>
            </div>
            <DonorProfileForm onSave={onCreateDonor} />
        </div>
    );
    
    return (
        <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gray-900 text-gray-200 p-4">
            <div className="absolute top-0 -left-1/4 w-96 h-96 bg-blue-600/50 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute -bottom-8 right-20 w-96 h-96 bg-orange-500/50 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-cyan-600/30 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

            <div className="relative z-10 w-full max-w-md">
                <div className="flex items-center justify-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-tr from-orange-500 to-blue-500 rounded-full mr-4"></div>
                    <div>
                        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-blue-500">SABR Portal</h2>
                        <p className="text-sm text-gray-400">Logistics for Good</p>
                    </div>
                </div>

                <div className="bg-black/20 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-2xl shadow-blue-500/20">
                    <div className="p-8">
                        {activeTab === 'login' ? <LoginForm /> : <SignUpForm />}
                    </div>

                    <div className="p-6 bg-black/10 border-t border-gray-700/50 text-center">
                        {activeTab === 'login' ? (
                            <p className="text-sm text-gray-400">
                                New to SABR? <button onClick={() => setActiveTab('signup')} className="font-semibold text-blue-400 hover:underline">Register here</button>
                            </p>
                        ) : (
                             <p className="text-sm text-gray-400">
                                Already registered? <button onClick={() => setActiveTab('login')} className="font-semibold text-blue-400 hover:underline">Login here</button>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
