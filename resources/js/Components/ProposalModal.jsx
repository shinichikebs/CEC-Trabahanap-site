import React, { useState } from 'react';

function ProposalModal({ showProposalModal, closeProposalModal, proposals, onProfileClick }) {
    const [selectedProposal, setSelectedProposal] = useState(null);

    const handleProposalClick = (proposal) => {
        setSelectedProposal(proposal);
    };

    const handleBackToList = () => {
        setSelectedProposal(null);
    };

    return (
        showProposalModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full">
                    <h2 className="text-xl font-semibold mb-4">Proposals Received</h2>
                    {selectedProposal ? (
                        <div className="max-h-96 overflow-auto">
                            <p className="text-gray-700">
                                <strong>Name:</strong> <span className="cursor-pointer text-blue-600" onClick={() => onProfileClick(selectedProposal.user)}>{selectedProposal.user.firstName + " " + selectedProposal.user.lastName}</span>
                            </p>
                            <p className="text-gray-700">
                                <strong>Proposal Text:</strong> {selectedProposal.proposal_text}
                            </p>
                            {selectedProposal.attachment_path && (
                                <p className="text-gray-700">
                                    <strong>Attachment:</strong> <a href={`/storage/${selectedProposal.attachment_path}`} target="_blank" className="text-blue-600">View Attachment</a>
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="max-h-60 overflow-auto">
                            {proposals && proposals.length > 0 ? (
                                proposals.map((proposal, index) => (
                                    <div key={index} className="mb-4 border-b pb-4 cursor-pointer" onClick={() => handleProposalClick(proposal)}>
                                        <p className="text-gray-700">
                                            <strong>Name:</strong> <span className="cursor-pointer text-blue-600" onClick={() => onProfileClick(proposal.user)}>{proposal.user.firstName + " " + proposal.user.lastName}</span>
                                        </p>
                                        <p className="text-gray-700">
                                            <strong>Proposal Text:</strong> {proposal.proposal_text.length > 50 
                                                ? `${proposal.proposal_text.substring(0, 50)}...` 
                                                : proposal.proposal_text}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p>No proposals available.</p>
                            )}
                        </div>
                    )}
                    <button
                        onClick={closeProposalModal}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Close
                    </button>
                    {selectedProposal && (
                        <button
                            onClick={handleBackToList}
                            className="mt-2 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                        >
                            Back to Proposals List
                        </button>
                    )}
                </div>
            </div>
        )
    );
}

export default ProposalModal;
