/**
 * Analytics Demo Component for Ambacht-Verse-Ontwerp
 * Demonstrates the comprehensive user flow tracking system
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  Users,
  MousePointer,
  FileText,
  Target,
  Activity,
} from "lucide-react";
import {
  useNavigationLogger,
  useInteractionLogger,
  useSessionLogger,
  useBreadcrumbLogger,
} from "@/hooks/useUserFlowLogger";

export const AnalyticsDemo = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Tracking hooks
  const { logNavigation, logSectionView } = useNavigationLogger();
  const { logClick, logButtonPress } = useInteractionLogger();
  const { sessionData, getSessionDuration } = useSessionLogger();
  const { addBreadcrumb, getJourneyPath, logJourneySummary } =
    useBreadcrumbLogger();

  useEffect(() => {
    // Log analytics demo view
    addBreadcrumb("analytics_demo_viewed");
    logSectionView("analytics-demo", 0);
  }, [addBreadcrumb, logSectionView]);

  const simulateUserJourney = () => {
    logButtonPress("simulate_journey", "analytics_demo");
    addBreadcrumb("user_journey_simulation_started");

    // Simulate a complete booking journey
    const steps = [
      "widget_displayed",
      "widget_hovered",
      "widget_clicked",
      "date_checker_opened",
      "date_selected",
      "booking_form_opened",
      "form_field_filled",
      "form_submitted",
      "booking_confirmed",
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        addBreadcrumb(`simulated_${step}`, { stepNumber: index + 1 });
        logClick(`demo_${step}`, { simulation: true });

        if (index === steps.length - 1) {
          logJourneySummary("completed");
          addBreadcrumb("simulation_completed");
        }
      }, index * 500);
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-serif text-forest-green">
          Analytics Tracking Demo
        </h2>
        <p className="text-forest-green/80 max-w-2xl mx-auto">
          Deze demo toont het uitgebreide user flow tracking systeem met
          breadcrumb logging, conversion funnel tracking, en form analytics.
        </p>
      </div>

      {/* Demo Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-burnt-orange" />
            Demo Controles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={simulateUserJourney} className="w-full">
              <MousePointer className="w-4 h-4 mr-2" />
              Simuleer User Journey
            </Button>

            <Button
              onClick={() => addBreadcrumb("demo_interaction")}
              variant="outline"
              className="w-full"
            >
              <Target className="w-4 h-4 mr-2" />
              Log Demo Interaction
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Session Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-burnt-orange" />
            Huidige Sessie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-burnt-orange">
                {sessionData.sessionId.slice(-8)}
              </div>
              <div className="text-sm text-forest-green/60">Session ID</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-burnt-orange">
                {sessionData.pageViews}
              </div>
              <div className="text-sm text-forest-green/60">Page Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-burnt-orange">
                {sessionData.interactions}
              </div>
              <div className="text-sm text-forest-green/60">Interactions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-burnt-orange">
                {Math.round(getSessionDuration() / 1000)}s
              </div>
              <div className="text-sm text-forest-green/60">Duration</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journey Path Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            User Journey Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {getJourneyPath().map((step: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <Badge variant="outline">{index + 1}</Badge>
                <span className="font-mono text-sm">{step}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
