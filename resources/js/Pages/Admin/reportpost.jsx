import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NewReport = () => {
    const [approvedUsers, setApprovedUsers] = useState([]);
    const [approvedPosts, setApprovedPosts] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [pendingPosts, setPendingPosts] = useState([]);
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
                fetchPendingPosts();
                fetchApprovedPosts();
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    const fetchApprovedPosts = () => {
        axios.get("/admin/approved-posts")
            .then((response) => setApprovedPosts(response.data.approvedPosts))
            .catch((error) => console.error("Error fetching approved posts:", error));
    };



    const fetchPendingPosts = () => {
        axios
            .get("/admin/pending-approval-posts")
            .then((response) => setPendingPosts(response.data.pendingPosts))
            .catch((error) => console.error("Error fetching pending posts:", error));
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Post Report</h1>

            <div className="mt-8">
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
 
                            <th className="border border-gray-300 p-2">Approved Posts</th>

                            <th className="border border-gray-300 p-2">Pending Posts</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: Math.max(approvedUsers.length, approvedPosts.length, pendingUsers.length, pendingPosts.length) }).map((_, index) => (
                            <tr key={index}>

                                {/* Approved Posts */}
                                <td className="border border-gray-300 p-2">
                                    {approvedPosts[index] ? (
                                        <div>
                                            {approvedPosts[index].job_title} <br />
                                            <span className="text-sm text-gray-600">{approvedPosts[index].email}</span>
                                        </div>
                                    ) : "—"}
                                </td>


                                {/* Pending Posts */}
                                <td className="border border-gray-300 p-2">
                                    {pendingPosts[index] ? (
                                        <div>
                                            {pendingPosts[index].job_title} <br />
                                            <span className="text-sm text-gray-600">{pendingPosts[index].email}</span>
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
