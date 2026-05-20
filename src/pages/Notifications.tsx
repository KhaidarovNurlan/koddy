import { useEffect } from 'react';

export const Notifications = () => {
    useEffect(() => {
        document.title = "Notifications - Koddy";
    }, []);

    return (
        <div className="flex-1 p-8 w-full max-w-[700px]">
            <h2 className="text-[20px] font-medium text-center">
                No notifications to show
            </h2>
        </div>
    );
};
