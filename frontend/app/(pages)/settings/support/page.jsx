'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';

// Mock data for reported posts
const mockReportedPosts = [
  {
    id: 1,
    postContent: "This is a sample post that was reported for inappropriate content",
    reportedAt: "2024-03-15T10:30:00",
    reportedBy: {
      id: 101,
      name: "John Doe",
      avatar: "/avatars/john.jpg"
    },
    adminFeedback: "Post contains offensive language. Approved for removal.",
    status: "removed"
  },
  {
    id: 2,
    postContent: "Another post that was flagged for review",
    reportedAt: "2024-03-14T15:45:00",
    reportedBy: {
      id: 102,
      name: "Jane Smith",
      avatar: "/avatars/jane.jpg"
    },
    adminFeedback: "Post was reviewed and found to be within community guidelines. Kept as is.",
    status: "kept"
  },
  {
    id: 3,
    postContent: "A post that needs attention",
    reportedAt: "2024-03-13T09:20:00",
    reportedBy: {
      id: 103,
      name: "Mike Johnson",
      avatar: "/avatars/mike.jpg"
    },
    adminFeedback: "Post was edited to remove sensitive information.",
    status: "edited"
  }
];

export default function SupportPage() {
  const [reportedPosts] = useState(mockReportedPosts);

  const getStatusColor = (status) => {
    switch (status) {
      case 'removed':
        return 'bg-red-100 text-red-800';
      case 'kept':
        return 'bg-green-100 text-green-800';
      case 'edited':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Reported Posts</h1>
      
      <div className="space-y-6">
        {reportedPosts.map((post) => (
          <Card key={post.id} className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                Reported Post #{post.id}
              </CardTitle>
              <Badge className={getStatusColor(post.status)}>
                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={post.reportedBy.avatar} />
                    <AvatarFallback>{post.reportedBy.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{post.reportedBy.name}</p>
                    <p className="text-sm text-gray-500">
                      Reported on {format(new Date(post.reportedAt), 'PPP')}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{post.postContent}</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Admin Feedback</h4>
                  <p className="text-blue-700">{post.adminFeedback}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
