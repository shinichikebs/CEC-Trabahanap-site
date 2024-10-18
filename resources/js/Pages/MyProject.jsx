import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import axios from 'axios';
import PostProject from './PostProject';  

function ProposalModal({ showProposalModal, closeProposalModal, proposalData }) {
    return (
        showProposalModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                    <h2 className="text-xl font-semibold mb-4">Proposal</h2>
                    {proposalData && proposalData.length > 0 ? (
                        proposalData.map((proposal, index) => (
                            <div key={index} className="mb-4">
                                <p className="text-gray-700">
                                    <strong>Name:</strong> {proposal.user.firstName + " " + proposal.user.lastName}    {/* To get user details refer to columns in users table (Note: when FK there are relationship methods look up lng sa models)*/}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Proposal Text:</strong> {proposal.proposal_text}
                                </p>
                                {proposal.attachment_path && (
                                    <p className="text-gray-700">
                                        <strong>Attachment:</strong> <a href={`/storage/${proposal.attachment_path}`} target="_blank" className="text-blue-600">View Attachment</a>
                                    </p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No proposals available.</p>
                    )}
                    <button
                        onClick={closeProposalModal}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        )
    );
}

export default function MyProject({ auth }) {
    const [projects, setProjects] = useState([]); 
    const [editingProject, setEditingProject] = useState(null); 
    const [successMessage, setSuccessMessage] = useState(''); 
    const [showProposalModal, setShowProposalModal] = useState(false); 
    const [proposalData, setProposalData] = useState(null); 

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
        }
    };

    
    const handleFormSuccess = (message) => {
        setSuccessMessage(message); 
        fetchProjects();
        setEditingProject(null); 
        setTimeout(() => setSuccessMessage(''), 3000); 
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
                    
                    projects.map((project) => (
                        <div key={project.id} className="bg-white dark:bg-gray-200 p-4 rounded-lg shadow-sm flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-black-900 dark:text-black">{project.job_title}</h3>
                                <p className="text-sm text-black-600 dark:text-black-400">Description: {project.job_description}</p>
                                <p className="text-sm text-black-600 dark:text-black-400">Category: {project.category}</p>
                                <p className="text-sm text-black-600 dark:text-black-400">Sub Category: {project.sub_category}</p>
                                <p className="text-sm text-black-600 dark:text-black-400">Days Post End: {project.days_post_end}</p>
                                <p className="text-sm text-black-600 dark:text-black-400">Budget: {project.budget}</p>
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
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                    onClick={() => handleDone(project.id)}
                                >
                                    Done
                                </button>

                                <button
                                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                                    onClick={() => handleShowProposal(project.id)} 
                                >
                                    Proposal
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

            {}
            <ProposalModal
                showProposalModal={showProposalModal}
                closeProposalModal={() => setShowProposalModal(false)}
                proposalData={proposalData}
            />
        </AuthenticatedLayout>
    );
}
