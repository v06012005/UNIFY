import React from "react";
import ModeSwitch from "@/components/global/ModeSwitch";
import SelectMenu from "@/components/global/LanguageSelect";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const languages = [
  {
    id: 1,
    name: "English",
  },
  {
    id: 2,
    name: "Vietnamese",
  },
];

const PreferenceSection = ({ title, description, children }) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle className="text-xl">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);

const page = () => {
  return (
    <div className="w-full max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Preferences</h1>
        <p className="text-neutral-500">Customize your experience with these settings</p>
      </div>

      <div className="space-y-6">
        <PreferenceSection
          title="App Theme"
          description="Set how your app should look like with your preferred theme."
        >
          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <i className="fa-solid fa-palette text-xl text-primary"></i>
              <span className="font-medium">Dark Mode</span>
            </div>
            <ModeSwitch />
          </div>
        </PreferenceSection>

        <PreferenceSection
          title="Language"
          description="See all texts, messages, titles in your preferred language."
        >
          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <i className="fa-solid fa-language text-xl text-primary"></i>
              <span className="font-medium">Interface Language</span>
            </div>
            <SelectMenu />
          </div>
        </PreferenceSection>

        <PreferenceSection
          title="Notifications"
          description="Manage how you receive notifications and updates."
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <i className="fa-solid fa-bell text-xl text-primary"></i>
                <span className="font-medium">Push Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <i className="fa-solid fa-envelope text-xl text-primary"></i>
                <span className="font-medium">Email Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </PreferenceSection>

        <PreferenceSection
          title="Privacy"
          description="Control your privacy settings and data sharing preferences."
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <i className="fa-solid fa-eye text-xl text-primary"></i>
                <span className="font-medium">Profile Visibility</span>
              </div>
              <select className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm">
                <option>Public</option>
                <option>Friends Only</option>
                <option>Private</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <i className="fa-solid fa-chart-line text-xl text-primary"></i>
                <span className="font-medium">Activity Status</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </PreferenceSection>
      </div>
    </div>
  );
};

export default page;
