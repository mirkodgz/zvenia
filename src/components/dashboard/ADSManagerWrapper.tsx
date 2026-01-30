import React, { useState } from 'react';
import AdsForm from './forms/AdsForm';
import AdsList from './AdsList';

interface ADSManagerWrapperProps {
    currentUser: any;
}

export default function ADSManagerWrapper({ currentUser }: ADSManagerWrapperProps) {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [editingAd, setEditingAd] = useState<any | null>(null);

    const handleSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
        setEditingAd(null); // Clear editing state on success
    };

    const handleEdit = (ad: any) => {
        setEditingAd(ad);
        // Scroll to top to show form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="w-full">
            <AdsForm
                currentUser={currentUser}
                onSuccess={handleSuccess}
                initialData={editingAd}
                onCancel={() => setEditingAd(null)}
            />
            <AdsList
                currentUser={currentUser}
                refreshTrigger={refreshTrigger}
                onEdit={handleEdit}
            />
        </div>
    );
}
