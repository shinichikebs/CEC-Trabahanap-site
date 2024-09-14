import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import axios from 'axios';
import PostProject from './PostProject';  // Import the PostProject component
import { Inertia } from '@inertiajs/inertia';


export default function MyProject({ auth }) {
    const [projects, setProjects] = useState([]); // Stores all projects of the logged-in user
    const [editingProject, setEditingProject] = useState(null); // Track the project being edited
    const [successMessage, setSuccessMessage] = useState(''); // State to show success message

    useEffect(() => {
        fetchProjects(); // Fetch projects when component mounts
    }, []);

    // Function to fetch projects from the server
    const fetchProjects = () => {
        axios.get('/dashboard-data')
            .then(response => {
                const userProjects = response.data.jobOffers.filter(
                    project => project.user_id === auth.user.id
                );
                setProjects(userProjects); // Set the logged-in user's projects
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
            });
    };

    // Function to handle editing a project
    const handleEdit = (project) => {
        setEditingProject(project); // Set the project to be edited
    };

    // Function to handle deleting a project
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this project?')) {
            axios.delete(`/post-project/${id}`)
                .then(() => {
                    setProjects(projects.filter(project => project.id !== id)); // Update the project list without the deleted project
                    setSuccessMessage('Project deleted successfully!');
                    setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
                })
                .catch(error => {
                    console.error('Error deleting project:', error);
                });
        }
    };

    // Function to handle form submission success
    const handleFormSuccess = (message) => {
        setSuccessMessage(message); // Show success message
        fetchProjects(); // Refresh the list of projects
        setEditingProject(null); // Reset the edit mode
        setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="bg-blue-900 text-white py-4 px-6 shadow-lg" style={{ minHeight: '80px' }}>
                    <h2 className="font-semibold text-xl leading-tight">
                        {editingProject ? 'Edit Project' : 'My Projects'}
                    </h2>
                </div>
            }
            showNavbar={!editingProject} // Hide the Navbar when editing
        >
            <div className="space-y-4">
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">{successMessage}</strong>
                    </div>
                )}

                {editingProject ? (
                    // If a project is being edited, show the PostProject form
                    <PostProject
                        auth={auth}  // Pass the auth object
                        jobOffer={editingProject}  // Pass the project being edited as a prop
                        onCancel={() => setEditingProject(null)}  // Function to cancel editing
                        onSuccess={(message) => handleFormSuccess(message)} // Handle success and refresh the project list
                    />
                ) : (
                    // Show the list of projects when not in edit mode
                    projects.map((project) => (
                        <div key={project.id} className="bg-white dark:bg-gray-200 p-4 rounded-lg shadow-sm flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-black-900 dark:text-black">{project.job_title}</h3>
                                <p className="text-sm text-black-600 dark:text-black-400">{project.job_description}</p>
                                <p className="text-sm text-black-600 dark:text-black-400">{project.budget}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{project.created_at}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    onClick={() => handleEdit(project)} // On edit, load the project data into the form
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                    onClick={() => handleDelete(project.id)} // On delete, remove the project
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
