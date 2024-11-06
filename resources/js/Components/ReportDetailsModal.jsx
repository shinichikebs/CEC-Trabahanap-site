// src/components/ReportDetailsModal.js
import React from "react";

const ReportDetailsModal = ({ report, onClose, onUserClick }) => {
    if (!report) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-lg">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                >
                    ✖
                </button>

                <h2 className="text-2xl font-semibold mb-4">Report Details</h2>
                <p><strong>From:</strong> {report.reporting_user_name}</p>
                <p>
                    <strong>To:</strong> 
                    <span
                        className="text-blue-500 hover:underline cursor-pointer"
                        onClick={() => onUserClick(report.user_id)}
                    >
                        {report.reported_user_name}
                    </span>
                </p>
                <p><strong>Description:</strong> {report.violation}</p>
            </div>
        </div>
    );
};

export default ReportDetailsModal;
