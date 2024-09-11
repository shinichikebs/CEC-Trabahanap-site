import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import axios from 'axios';
import PostProject from './PostProject';  // Import the PostProject component

export default function MyProject({ auth }) {
    const [projects, setProjects] = useState([]);
    const [editingProject, setEditingProject] = useState(null); // Track the project being edited

    useEffect(() => {
        // Fetch the logged-in user's projects
        axios.get('/dashboard-data')
            .then(response => {
                // Filter the job offers to show only those created by the logged-in user
                const userProjects = response.data.jobOffers.filter(
                    project => project.user_id === auth.user.id
                );
                setProjects(userProjects);
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
            });
    }, [auth.user.id]);

    const handleEdit = (project) => {
        // Set the project to be edited, will pass this as props to PostProject
        setEditingProject(project);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this project?')) {
            axios.delete(`/post-project/${id}`)
                .then(() => {
                    setProjects(projects.filter(project => project.id !== id));
                })
                .catch(error => {
                    console.error('Error deleting project:', error);
                });
        }
    };

    // Define a consistent height and padding for the header
    const headerContent = (
        <div className="bg-blue-900 text-white py-4 px-6 shadow-lg" style={{ minHeight: '80px' }}>
            <h2 className="font-semibold text-xl leading-tight">
                {editingProject ? 'Edit Project' : 'My Projects'}
            </h2>
        </div>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={headerContent}  // Pass consistent header content with fixed height
            showNavbar={!editingProject} // Hide the Navbar if editingProject is true
        >
            <div className="space-y-4">
                {editingProject ? (
                    // Render the PostProject form with the selected project data for editing
                    <PostProject
                        auth={auth}  // Pass the auth object
                        jobOffer={editingProject}  // Pass the project being edited as a prop
                        onCancel={() => setEditingProject(null)}  // Function to cancel editing
                    />
                ) : (
                    // Show the list of projects when not in edit mode
                    projects.map((project) => (
                        <div key={project.id} className="bg-white dark:bg-gray-200 p-4 rounded-lg shadow-sm flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-black-900 dark:text-black">{project.job_title}</h3>
                                <p className="text-sm text-black-600 dark:text-black-400">{project.job_description}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{project.created_at}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    onClick={() => handleEdit(project)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                    onClick={() => handleDelete(project.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </AuthenticatedLayout>
    );
}
