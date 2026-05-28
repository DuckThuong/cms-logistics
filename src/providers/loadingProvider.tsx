import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext<{
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
}>({
    isLoading: false,
    setLoading: () => {},
});

export const LoadingProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    const setLoading = (loading: boolean) => {
        if (loading) {
            setShouldRender(true);
            setIsLoading(true);
        } else {
            setIsLoading(false);
            setTimeout(() => setShouldRender(false), 300);
        }
    };

    return (
        <LoadingContext.Provider value={{ isLoading, setLoading }}>
            {children}

            {shouldRender && (
                <div
                    className={`loading-overlay ${isLoading ? 'show' : 'hide'}`}
                >
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                    </div>
                </div>
            )}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    return context;
};
