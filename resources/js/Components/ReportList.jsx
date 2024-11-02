// src/components/ReportList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReportDetailsModal from "./ReportDetailsModal";
import UserProfile from "./UserProfile";

export default function ReportList() {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = () => {
        axios
            .get("/admin/reports")
            .then((response) => setReports(response.data.data))
            .catch((error) => console.error("Error fetching reports:", error));
    };

    const handleReportClick = (report) => {
        setSelectedReport(report);
    };

    const handleCloseModal = () => {
        setSelectedReport(null);
    };

    const handleUserClick = (userId) => {
        if (!userId) return; // Prevent further actions if userId is undefined
        axios
            .get(`/admin/user/${userId}`)
            .then((response) => setSelectedUser(response.data))
            .catch((error) => console.error("Error fetching user data:", error));
    };

    const handleCloseUserProfile = () => {
        setSelectedUser(null);
    };

    return (
        <div className="space-y-4">
            {reports.length > 0 ? (
                reports.map((report, index) => (
                    <div
                        key={index}
                        className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
                        onClick={() => handleReportClick(report)}
                    >
                        <p><strong>From:</strong> {report.reporting_user_name}</p>
                        <p><strong>To:</strong> {report.reported_user_name}</p>
                        <p><strong>Description:</strong> {report.violation}</p>
                    </div>
                ))
            ) : (
                <p>No reports found.</p>
            )}

            {selectedReport && (
                <ReportDetailsModal
                    report={selectedReport}
                    onClose={handleCloseModal}
                    onUserClick={() => handleUserClick(selectedReport.user_id)} // Pass correct user_id here
                />
            )}

            {selectedUser && (
                <UserProfile user={selectedUser} onClose={handleCloseUserProfile} />
            )}
        </div>
    );
}
