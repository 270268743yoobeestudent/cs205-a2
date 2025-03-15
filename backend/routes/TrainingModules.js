import React, { useEffect, useState } from 'react';

const TrainingModulesPage = () => {
    const [trainingModules, setTrainingModules] = useState(null); // Initialize as null

    useEffect(() => {
        fetch('/modules') // Adjust this URL if needed
            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched training modules:', data);
                setTrainingModules(data);
            })
            .catch((error) => console.error('Error fetching modules:', error));
    }, []);

    if (!trainingModules) {
        return <p>Loading training modules...</p>; // Show loading state
    }

    return (
        <div>
            <h2>Training Modules</h2>
            {trainingModules.length > 0 ? (
                trainingModules.map((module, index) => (
                    <p key={index}>{module.title}</p>
                ))
            ) : (
                <p>No training modules available.</p>
            )}
        </div>
    );
};

export default TrainingModulesPage;
