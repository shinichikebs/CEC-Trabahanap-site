// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import DashboardContent from "./DashboardContent";

export default function Dashboard() {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [newMessages, setNewMessages] = useState(0);

    useEffect(() => {
        // Fetch total user count from the backend
        Inertia.get("/user-count", {}, {
            onSuccess: (page) => {
                setTotalUsers(page.props.count); // Set total users from response
            }
        });

        // Fetch total posts from the backend
        Inertia.get("/total-posts", {}, {
            onSuccess: (page) => {
                setTotalPosts(page.props.count); // Set total posts from response
            }
        });

        // Fetch new messages count (if you have an endpoint for that)
        Inertia.get("/new-messages", {}, {
            onSuccess: (page) => {
                setNewMessages(page.props.count); // Set new messages from response
            }
        });
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <DashboardContent 
                totalUsers={totalUsers} 
                totalPosts={totalPosts} 
                newMessages={newMessages} 
            />
        </div>
    );
}
