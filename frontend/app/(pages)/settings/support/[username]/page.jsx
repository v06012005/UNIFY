"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useReports } from "@/components/provider/ReportProvider";
import { useParams } from "next/navigation";

export default function SupportPage() {
  const { username } = useParams();
  const {
    myReportedEntities,
    reportsOnMyPosts,
    fetchMyReportedEntities,
    fetchReportsOnMyPosts,
  } = useReports();
  const [activeImageIndex, setActiveImageIndex] = useState({});
  const [sentReports, setSentReports] = useState([]);
  const [receivedReports, setReceivedReports] = useState([]);

  useEffect(() => {
    if (username) {
      fetchMyReportedEntities(username, (data) => {
        console.log("Fetched reported entities:", data);
        setSentReports(data || []);
      });
      fetchReportsOnMyPosts(username, (data) => {
        console.log("Fetched reports on my posts:", data);
        setReceivedReports(data || []);
      });
    }
  }, [username, fetchMyReportedEntities, fetchReportsOnMyPosts]);

  const handleImageChange = (reportId, direction) => {
    setActiveImageIndex((prev) => {
      const currentIndex = prev[reportId] || 0;
      const report = [...sentReports, ...receivedReports].find(
        (r) => r.id === reportId
      );
      const mediaArr = report?.reportedEntity?.media || [];
      const maxIndex = mediaArr.length - 1;

      let newIndex;
      if (direction === "next") {
        newIndex = currentIndex === maxIndex ? 0 : currentIndex + 1;
      } else {
        newIndex = currentIndex === 0 ? maxIndex : currentIndex - 1;
      }

      return { ...prev, [reportId]: newIndex };
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 0:
        return (
          <>
            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
              Under Review
            </Badge>
            <span className="text-xs text-gray-500 block mt-1">Someone has reported your post, and we are currently reviewing it. Please take a moment to review your own post before we make a decision to approve or remove it from the platform.</span>
          </>
        );
      case 1:
        return (
          <>
            <Badge className="bg-green-100 text-green-800 text-xs">
              Approved
            </Badge>
            <span className="text-xs text-gray-500 block mt-1">Your post has violated our community guidelines and has been removed from feeds and your personal page. You can review the post here, and we encourage you to revisit our policies to ensure proper use of the platform.</span>
          </>
        );
      case 2:
        return (
          <>
            <Badge className="bg-red-100 text-red-800 text-xs">
              Rejected
            </Badge>
            <span className="text-xs text-gray-500 block mt-1">This report has been rejected.</span>
          </>
        );
      default:
        return (
          <>
            <Badge className="bg-gray-100 text-gray-800 text-xs">
              Unknown
            </Badge>
            <span className="text-xs text-gray-500 block mt-1">Status unknown.</span>
          </>
        );
    }
  };
  

  const ReportCard = ({ report, type }) => {
    if (!report || !report.reportedEntity) {
      return null;
    }

    return (
      <Card className="w-full mb-4">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Image Carousel */}
            <div className="relative w-1/2">
              <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800">
                {report.reportedEntity.media?.[activeImageIndex[report.id] || 0]
                  ?.url ? (
                  <>
                    {report.reportedEntity.media[
                      activeImageIndex[report.id] || 0
                    ].mediaType === "IMAGE" ? (
                      <img
                      key={report.reportedEntity.media[activeImageIndex[report.id] || 0].url} 
                        src={
                          report.reportedEntity.media[
                            activeImageIndex[report.id] || 0
                          ].url
                        }
                        alt={
                          report.reportedEntity.captions || "Reported content"
                        }
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                      key={report.reportedEntity.media[activeImageIndex[report.id] || 0].url} 
                        src={
                          report.reportedEntity.media[
                            activeImageIndex[report.id] || 0
                          ].url
                        }
                        controls
                        className="w-full h-full object-cover"
                      />
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No media available
                  </div>
                )}
                {report.reportedEntity.media?.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleImageChange(report.id, "prev")}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleImageChange(report.id, "next")}
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
                <h3 className="text-lg font-semibold mb-1">
                  {report.reportedEntity.captions || "No title"}
                </h3>
                <div className="flex items-center gap-3 text-gray-500">
                  <span className="flex items-center gap-1">
                    <Heart size={14} />
                    {report.reportedEntity.likes || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={14} />
                    {report.reportedEntity.comments || 0}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs dark:text-gray-300 text-gray-600">
                  Reported on {format(new Date(report.reportedAt), "PPP")}
                </p>
                <p className="text-xs dark:text-gray-300 text-gray-600">
                  <span className="font-medium">Author:</span>{" "}
                  {report.reportedEntity?.user?.username}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Reason:</span> {report.reason}
                </p>

                {type === "received" && (
                  <>
                    {getStatusBadge(report.status)}
                    {report.adminNotes && (
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Admin Notes:</span>{" "}
                        {report.adminNotes}
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="pt-2">
                {type === "sent" ? (
                  <Button variant="outline" size="sm" className="w-full">
                    Cancel Report
                  </Button>
                ) : (
                  report.status === 2 && (
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
  };

  return (
    <div className="container mx-auto py-6 px-4 h-screen overflow-y-auto scrollbar-hide">
      <h1 className="text-2xl font-bold mb-6">Report Management</h1>

      <Tabs defaultValue="sent" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="sent">Reports I've Sent</TabsTrigger>
          <TabsTrigger value="received">Reports Against My Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="sent" className="space-y-4">
          {sentReports.length > 0 ? (
            sentReports.map((report) => (
              <ReportCard key={report.id} report={report} type="sent" />
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              No reports sent yet
            </div>
          )}
        </TabsContent>

        <TabsContent value="received" className="space-y-4">
          {receivedReports.length > 0 ? (
            receivedReports.map((report) => (
              <ReportCard key={report.id} report={report} type="received" />
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              No reports received yet
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
