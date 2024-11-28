import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import axios from 'axios';
import PostProject from './PostProject';
import ProposalModal from '@/Components/ProposalModal';
import UserProfileModal from '@/Components/UserProfileModal'; // Corrected import

export default function MyProject({ auth }) {
    const [projects, setProjects] = useState([]);
    const [editingProject, setEditingProject] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [showProposalModal, setShowProposalModal] = useState(false);
    const [proposalData, setProposalData] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = () => {
        axios.get('/dashboard-data')
            .then(response => {
                const userProjects = response.data.jobOffers.filter(
                    project => project.user_id === auth.user.id
                );
                setProjects(userProjects);
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
            });
    };

    const handleEdit = (project) => {
        setEditingProject(project);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this job offer?')) {
            axios.delete(`/post-project/${id}`)
                .then(() => {
                    setProjects(projects.filter(project => project.id !== id));
                    setSuccessMessage('Job offer deleted successfully!');
                    setTimeout(() => setSuccessMessage(''), 3000);
                })
                .catch(error => {
                    console.error('Error deleting job offer:', error);
                });
        }
    };

    const handleShowProposal = (jobOfferId) => {
        axios.get(`/proposal/${jobOfferId}`)
            .then((response) => {
                setProposalData(response.data.proposal);
                setShowProposalModal(true);
            })
            .catch(error => {
                console.error('Error fetching proposal:', error);
            });
    };

    const handleDone = (id) => {
        if (confirm('Are you sure you want to mark this job offer as done?')) {
            axios.post(`/post-project/${id}/done`)
                .then(() => {
                    setProjects(projects.filter(project => project.id !== id));
                })
                .catch(error => {
                    console.error('Error moving job offer to done:', error);
                });
    };

    }

    const handleProfileClick = (user) => {
        setSelectedUser(user);
        setShowProfileModal(true);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="bg-blue-900 text-white py-4 px-6 shadow-lg" style={{ minHeight: '80px' }}>
                    <h2 className="font-semibold text-xl leading-tight">
                        {editingProject ? 'Edit Job Offer' : 'My Job Offers'}
                    </h2>
                </div>
            }
            showNavbar={!editingProject}
        >
            <div className="space-y-4">
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">{successMessage}</strong>
                    </div>
                )}

                {editingProject ? (
                    <PostProject
                        auth={auth}
                        jobOffer={editingProject}
                        onCancel={() => setEditingProject(null)}
                        onSuccess={(message) => handleFormSuccess(message)}
                    />
                ) : (
                    <>
                        {projects.length > 0 ? (
                            projects.map((project) => (
                                <div key={project.id} className="bg-white dark:bg-gray-200 p-4 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-center">
                                    <div className="w-full md:w-3/4">
                                        <h3 className="text-lg font-bold text-black-900 dark:text-black">{project.job_title}</h3>
                                        <p className="text-sm text-black-600 dark:text-black-400">
                                            Description: {project.job_description.length > 75
                                                ? `${project.job_description.substring(0, 75)}...`
                                                : project.job_description}
                                        </p>
                                        <p className="text-sm text-black-600 dark:text-black-400">Category: {project.category}</p>
                                        <p className="text-sm text-black-600 dark:text-black-400">Sub Category: {project.sub_category}</p>
                                        <p className="text-sm text-black-600 dark:text-black-400">Project Duration: {project.days_post_end}</p>
                                        <p className="text-sm text-black-600 dark:text-black-400">Budget: ₱{project.budget}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{project.created_at}</p>
                                    </div>
                                    <div className="flex space-x-2 mt-4 md:mt-0">
                                        <button
                                            className="bg-[#231955] text-white px-4 py-2 rounded"
                                            onClick={() => handleEdit(project)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="bg-[#231955] text-white px-4 py-2 rounded"
                                            onClick={() => handleDone(project.id)}
                                        >
                                            Done
                                        </button>

                                        <button
                                            className="bg-[#231955] text-white px-4 py-2 rounded"
                                            onClick={() => handleShowProposal(project.id)}
                                        >
                                            Proposal
                                        </button>

                                        <button
                                            className="bg-[#231955] text-white px-4 py-2 rounded"
                                            onClick={() => handleDelete(project.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <h1 className="text-center text-lg text-gray-700">No Projects Posted</h1>
                        )}
                    </>
                )}
            </div>

            {/* Proposal Modal */}
            <ProposalModal
                showProposalModal={showProposalModal}
                closeProposalModal={() => setShowProposalModal(false)}
                proposals={proposalData}
                onProfileClick={handleProfileClick}
            />

            {/* User Profile Modal */}
            <UserProfileModal
                showProfileModal={showProfileModal}
                closeUserProfileModal={() => setShowProfileModal(false)}
                user={selectedUser}
            />
        </AuthenticatedLayout>
    );
}
