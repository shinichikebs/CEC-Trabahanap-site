import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NewReport = () => {
    const [approvedUsers, setApprovedUsers] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [restrictUsers, setRestrictUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalJobsDone, setTotalJobsDone] = useState(0);

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
            .then((response) => setRestrictUsers(response.data.restrictUsers)) // Corrected response data key
            .catch((error) => console.error("Error fetching restricted users:", error));
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">User Account Report</h1>
            <div className="mt-8">
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
