import React, { useState } from 'react';
import { Icon } from '../components/Icon';

interface AboutPageProps {
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const InfoCard: React.FC<{
    icon: React.ComponentProps<typeof Icon>['icon'];
    title: string;
    description: string;
}> = ({ icon, title, description }) => (
    <div 
        className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 flex items-start space-x-4 transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02] glow-on-hover"
        style={{ '--glow-color': '96, 165, 250' } as React.CSSProperties}
    >
        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-500/20 text-blue-500">
            <Icon icon={icon} className="w-6 h-6" title={title} />
        </div>
        <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
    </div>
);

const CallToActionCard: React.FC<{
    icon: React.ComponentProps<typeof Icon>['icon'];
    title: string;
    description: string;
}> = ({ icon, title, description }) => (
     <div 
        className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 text-center transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02] hover:border-solid glow-on-hover"
        style={{ '--glow-color': '249, 115, 22' } as React.CSSProperties}
    >
        <div className="mx-auto w-12 h-12 mb-4 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center">
            <Icon icon={icon} className="w-6 h-6 text-orange-500" title={title} />
        </div>
        <h3 className="text-xl font-bold text-orange-500">{title}</h3>
        <p className="mt-2 text-gray-700 dark:text-gray-300">{description}</p>
    </div>
)

export const AboutPage: React.FC<AboutPageProps> = ({ showToast }) => {
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setContactForm(prev => ({...prev, [name]: value}));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate sending the message
        console.log('Form submitted:', contactForm);
        showToast('Your message has been sent!', 'success');
        // Reset form
        setContactForm({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="p-8 bg-stone-50 dark:bg-gray-800">
            <div className="max-w-5xl mx-auto">
                <div className="relative rounded-xl overflow-hidden p-8 mb-12 bg-gradient-to-tr from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 text-center">
                    <div
                        className="absolute inset-0 bg-repeat opacity-[0.03] dark:opacity-[0.02]"
                        style={{ backgroundImage: `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')` }}
                    ></div>
                    <div className="relative z-10">
                         <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">About SABR: Logistics for Good</h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400">
                            Bridging the gap between abundance and need by optimizing food rescue logistics.
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 mb-12 transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02] glow-on-hover" style={{'--glow-color': '96, 165, 250'} as React.CSSProperties}>
                     <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">The Challenge We Address</h2>
                     <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Every year, millions of tons of perfectly good food go to waste, while countless individuals and families face food insecurity. Food banks and NGOs are on the front lines of this battle, but they often face overwhelming logistical hurdles. Inefficient matching can lead to spoilage—sometimes as much as 40% of donations—and delays in getting critical supplies to those who need them most. SABR was built to solve this problem.
                     </p>
                </div>
                
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">How SABR Helps</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <InfoCard 
                            icon="inventory"
                            title="Centralized Inventory"
                            description="Track all donations in real-time. Monitor stock levels, expiration dates, dietary information, and value with a simple, powerful interface."
                        />
                        <InfoCard 
                            icon="donors"
                            title="Donor Coordination"
                            description="Provide donors a dedicated portal to submit donations, track their journey, and see their impact. Automate receipts and communication."
                        />
                        <InfoCard 
                            icon="matches"
                            title="Targeted Matching"
                            description="Quickly identify the needs of shelters and community kitchens. Manually match available inventory to the most urgent requirements with full control."
                        />
                         <InfoCard 
                            icon="volunteers"
                            title="Volunteer Management"
                            description="Organize your team of volunteers, from drivers to warehouse staff. Assign tasks and manage schedules to ensure smooth on-the-ground operations."
                        />
                         <InfoCard 
                            icon="reports"
                            title="Insightful Reporting"
                            description="Visualize your impact with data-driven reports. Track inventory trends, donor contributions, and distribution metrics to make informed decisions."
                        />
                         <InfoCard 
                            icon="check-circle"
                            title="Reduced Waste"
                            description="By prioritizing items with the nearest expiration dates and ensuring faster, more accurate matches, SABR directly reduces food spoilage."
                        />
                    </div>
                </div>

                 <div className="mt-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">Join Our Network</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <CallToActionCard 
                            icon="donors"
                            title="Become a Donor"
                            description="Partner with us to ensure your surplus food reaches those who need it most, efficiently and without waste."
                        />
                        <CallToActionCard 
                            icon="beneficiaries"
                            title="Register as a Beneficiary"
                            description="Join our network to list your needs and receive timely, appropriate donations for your community."
                        />
                        <CallToActionCard 
                            icon="volunteers"
                            title="Volunteer Your Time"
                            description="Lend your time and skills to power our mission on the ground. Every hour helps make a difference."
                        />
                    </div>
                </div>

                <div className="mt-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">Contact Us</h2>
                     <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out hover:shadow-lg">
                        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">Have a question or want to get involved? Send us a message!</p>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Your Name</label>
                                    <input type="text" name="name" id="name" value={contactForm.name} onChange={handleFormChange} required className="w-full py-2 px-3 text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Your Email</label>
                                    <input type="email" name="email" id="email" value={contactForm.email} onChange={handleFormChange} required className="w-full py-2 px-3 text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Subject</label>
                                <input type="text" name="subject" id="subject" value={contactForm.subject} onChange={handleFormChange} required className="w-full py-2 px-3 text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Message</label>
                                <textarea name="message" id="message" rows={4} value={contactForm.message} onChange={handleFormChange} required className="w-full py-2 px-3 text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                            </div>
                            <div className="text-right">
                                <button type="submit" className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    <Icon icon="message-square" className="w-5 h-5 mr-2" title="Send Message" />
                                    Send Message
                                </button>
                            </div>
                        </form>
                     </div>
                </div>
            </div>
        </div>
    );
};