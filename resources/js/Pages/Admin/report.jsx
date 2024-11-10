import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

const NewReport = () => {
    const [approvedUsers, setApprovedUsers] = useState([]);
    const [approvedPosts, setApprovedPosts] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [pendingPosts, setPendingPosts] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalJobsDone, setTotalJobsDone] = useState(0);
    const [jobDone, setJobDone] = useState([]);

    // Ref for the report content
    const reportRef = useRef();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios
            .get("/admin-dashboard-data")
            .then((response) => {
                setTotalUsers(response.data.totalUsers);
                setTotalPosts(response.data.totalPosts);
                setTotalJobsDone(response.data.totalJobsDone);
                fetchPendingUsers();
                fetchPendingPosts();
                fetchApprovedUsers();
                fetchApprovedPosts();
                fetchJobDone();
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    const fetchApprovedUsers = () => axios.get("/admin/approved-users")
        .then((response) => setApprovedUsers(response.data.approvedUsers))
        .catch((error) => console.error("Error fetching approved users:", error));

    const fetchApprovedPosts = () => axios.get("/admin/approved-posts")
        .then((response) => setApprovedPosts(response.data.approvedPosts))
        .catch((error) => console.error("Error fetching approved posts:", error));

    const fetchPendingUsers = () => axios.get("/admin/pending-approval-users")
        .then((response) => setPendingUsers(response.data.pendingUsers))
        .catch((error) => console.error("Error fetching pending users:", error));

    const fetchPendingPosts = () => axios.get("/admin/pending-approval-posts")
        .then((response) => setPendingPosts(response.data.pendingPosts))
        .catch((error) => console.error("Error fetching pending posts:", error));

    const fetchJobDone = () => axios.get("/admin/job-done")
        .then((response) => setJobDone(response.data.jobDone))
        .catch((error) => console.error("Error fetching job done data:", error));

    // Function to generate PDF
    const handlePrintPDF = () => {
        const element = reportRef.current;
        const options = {
            margin:       0.5,
            filename:     'Report.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Generate PDF
        html2pdf().set(options).from(element).save();
    };

    return (
        <div className="container mx-auto p-4">
            {/* Print Button */}
            <div className="flex justify-end mb-4">
                <button 
                    onClick={handlePrintPDF} 
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
                >
                    Print PDF
                </button>
            </div>

            {/* Report Component */}
            <div ref={reportRef}> {/* Attach ref here */}
                <h1 className="text-2xl font-bold">Report</h1>

                <div className="mt-8">
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 p-2">Approved Users</th>
                                <th className="border border-gray-300 p-2">Approved Posts</th>
                                <th className="border border-gray-300 p-2">Pending Users</th>
                                <th className="border border-gray-300 p-2">Pending Posts</th>
                                <th className="border border-gray-300 p-2">Job Done</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: Math.max(approvedUsers.length, approvedPosts.length, pendingUsers.length, pendingPosts.length, jobDone.length) }).map((_, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 p-2">
                                        {approvedUsers[index] ? (
                                            <div>
                                                {approvedUsers[index].firstName} {approvedUsers[index].lastName} <br />
                                                <span className="text-sm text-gray-600">{approvedUsers[index].email}</span>
                                            </div>
                                        ) : "—"}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        {approvedPosts[index] ? (
                                            <div>
                                                {approvedPosts[index].job_title} <br />
                                                <span className="text-sm text-gray-600">{approvedPosts[index].email}</span>
                                            </div>
                                        ) : "—"}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        {pendingUsers[index] ? (
                                            <div>
                                                {pendingUsers[index].firstName} {pendingUsers[index].lastName} <br />
                                                <span className="text-sm text-gray-600">{pendingUsers[index].email}</span>
                                            </div>
                                        ) : "—"}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        {pendingPosts[index] ? (
                                            <div>
                                                {pendingPosts[index].job_title} <br />
                                                <span className="text-sm text-gray-600">{pendingPosts[index].email}</span>
                                            </div>
                                        ) : "—"}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        {jobDone[index] ? (
                                            <div>
                                                {jobDone[index].job_title} <br />
                                                <span className="text-sm text-gray-600">{jobDone[index].user_id}</span>
                                            </div>
                                        ) : "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default NewReport;
