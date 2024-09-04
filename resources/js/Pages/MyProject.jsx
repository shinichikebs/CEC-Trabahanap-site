import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import axios from 'axios';

export default function PostProject({ auth }) {
    const [projects, setProjects] = useState([]);

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

    const handleEdit = (id) => {
        router.get(`/post-project/${id}/edit`);
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    My Projects
                </h2>
            }
        >
            <div className="space-y-4">
                {projects.map((project) => (
                    <div key={project.id} className="bg-white dark:bg-gray-200 p-4 rounded-lg shadow-sm flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-black-900 dark:text-black">{project.job_title}</h3>
                            <p className="text-sm text-black-600 dark:text-black-400">{project.job_description}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{project.created_at}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button 
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={() => handleEdit(project.id)}
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
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
