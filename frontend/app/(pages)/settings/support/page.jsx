'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";

// Mock data for reports sent by user
const mockSentReports = [
  {
    id: 1,
    postTitle: "Summer Vacation Photos",
    images: ["/posts/summer1.jpg", "/posts/summer2.jpg", "/posts/summer3.jpg"],
    likes: 245,
    comments: 32,
    reportReason: "Inappropriate Content",
    reportedAt: "2024-03-15T10:30:00",
    status: "under_review"
  },
  {
    id: 2,
    postTitle: "City Views",
    images: ["/posts/city1.jpg", "/posts/city2.jpg"],
    likes: 189,
    comments: 15,
    reportReason: "Spam",
    reportedAt: "2024-03-14T15:45:00",
    status: "reviewed"
  }
];

// Mock data for reports against user's posts
const mockReceivedReports = [
  {
    id: 1,
    postTitle: "Beach Day",
    images: ["/posts/beach1.jpg", "/posts/beach2.jpg"],
    likes: 156,
    comments: 23,
    reportReason: "Violates Community Guidelines",
    reportedAt: "2024-03-15T09:20:00",
    reviewStatus: "Under Review",
    adminNotes: null
  },
  {
    id: 2,
    postTitle: "Mountain Hiking",
    images: ["/posts/mountain1.jpg", "/posts/mountain2.jpg"],
    likes: 278,
    comments: 45,
    reportReason: "Inappropriate Content",
    reportedAt: "2024-03-14T14:30:00",
    reviewStatus: "Reviewed",
    adminNotes: "Content reviewed and found to be within guidelines. No action taken."
  }
];

export default function SupportPage() {
  const [sentReports] = useState(mockSentReports);
  const [receivedReports] = useState(mockReceivedReports);
  const [activeImageIndex, setActiveImageIndex] = useState({});

  const handleImageChange = (reportId, direction) => {
    setActiveImageIndex(prev => {
      const currentIndex = prev[reportId] || 0;
      const report = [...sentReports, ...receivedReports].find(r => r.id === reportId);
      const maxIndex = report.images.length - 1;
      
      let newIndex;
      if (direction === 'next') {
        newIndex = currentIndex === maxIndex ? 0 : currentIndex + 1;
      } else {
        newIndex = currentIndex === 0 ? maxIndex : currentIndex - 1;
      }
      
      return { ...prev, [reportId]: newIndex };
    });
  };

  const ReportCard = ({ report, type }) => (
    <Card className="w-full mb-4">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Image Carousel */}
          <div className="relative w-1/2">
            <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-gray-100">
              <img
                src={report.images[activeImageIndex[report.id] || 0]}
                alt={report.postTitle}
                className="w-full h-full object-cover"
              />
              {report.images.length > 1 && (
                <>
                  <button
                    onClick={() => handleImageChange(report.id, 'prev')}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => handleImageChange(report.id, 'next')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="w-1/2 space-y-2">
            <div>
              <h3 className="text-lg font-semibold mb-1">{report.postTitle}</h3>
              <div className="flex items-center gap-3 text-gray-600">
                <span className="flex items-center gap-1">
                  <Heart size={14} />
                  {report.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={14} />
                  {report.comments}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-600">
                Reported on {format(new Date(report.reportedAt), 'PPP')}
              </p>
              <p className="text-sm">
                <span className="font-medium">Reason:</span> {report.reportReason}
              </p>
              
              {type === 'received' && (
                <>
                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    {report.reviewStatus}
                  </Badge>
                  {report.adminNotes && (
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Admin Notes:</span> {report.adminNotes}
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="pt-2">
              {type === 'sent' ? (
                <Button variant="outline" size="sm" className="w-full">
                  Cancel Report
                </Button>
              ) : (
                report.reviewStatus === 'Reviewed' && (
                  <Button variant="outline" size="sm" className="w-full">
                    Request Another Review
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-6 px-4 h-screen overflow-y-auto scrollbar-hide">
      <h1 className="text-2xl font-bold mb-6">Report Management</h1>
      
      <Tabs defaultValue="sent" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="sent">Reports I've Sent</TabsTrigger>
          <TabsTrigger value="received">Reports Against My Posts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sent" className="space-y-4">
          {sentReports.map((report) => (
            <ReportCard key={report.id} report={report} type="sent" />
          ))}
        </TabsContent>
        
        <TabsContent value="received" className="space-y-4">
          {receivedReports.map((report) => (
            <ReportCard key={report.id} report={report} type="received" />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
