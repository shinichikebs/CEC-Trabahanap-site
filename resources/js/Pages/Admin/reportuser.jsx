import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

const NewReport = () => {
    const [approvedUsers, setApprovedUsers] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [restrictUsers, setRestrictUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalJobsDone, setTotalJobsDone] = useState(0);

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
                fetchApprovedUsers();
                fetchRestrictUsers();
            })
            .catch((error) => console.error("Error fetching data:", error));
    };

    const fetchApprovedUsers = () => {
        axios.get("/admin/approved-users")
            .then((response) => setApprovedUsers(response.data.approvedUsers))
            .catch((error) => console.error("Error fetching approved users:", error));
    };

    const fetchPendingUsers = () => {
        axios
            .get("/admin/pending-approval-users")
            .then((response) => setPendingUsers(response.data.pendingUsers))
            .catch((error) => console.error("Error fetching pending users:", error));
    };

    const fetchRestrictUsers = () => {
        axios
            .get("/admin/restricted-users")
            .then((response) => setRestrictUsers(response.data.restrictUsers))
            .catch((error) => console.error("Error fetching restricted users:", error));
    };

    const handlePrint = () => {
        const element = reportRef.current;
        const options = {
            margin: 0.5,
            filename: 'User_Account_Report.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().from(element).set(options).save();
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">User Account Report</h1>
                <button
                    onClick={handlePrint}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Print PDF
                </button>
            </div>

            <div ref={reportRef} className="mt-8">
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2">Approved Users</th>
                            <th className="border border-gray-300 p-2">Pending Users</th>
                            <th className="border border-gray-300 p-2">Restricted Users</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: Math.max(approvedUsers.length, pendingUsers.length, restrictUsers.length) }).map((_, index) => (
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
                                    {pendingUsers[index] ? (
                                        <div>
                                            {pendingUsers[index].firstName} {pendingUsers[index].lastName} <br />
                                            <span className="text-sm text-gray-600">{pendingUsers[index].email}</span>
                                        </div>
                                    ) : "—"}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {restrictUsers[index] ? (
                                        <div>
                                            {restrictUsers[index].firstName} {restrictUsers[index].lastName} <br />
                                            <span className="text-sm text-gray-600">{restrictUsers[index].email}</span>
                                        </div>
                                    ) : "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NewReport;
