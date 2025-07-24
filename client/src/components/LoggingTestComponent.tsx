
/**
 * Test component to demonstrate logging functionality
 * This can be removed in production - it's for testing the logging system
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { withLogging, withDetailedLogging } from "@/lib/withLogging";
import { useComponentTracking } from "@/hooks/useComponentLogger";
import { UserFlowLogger } from "@/lib/logger";

interface TestComponentProps {
  title?: string;
  onAction?: (data: { count: number; text: string }) => void;
}

// Modified the type definition to match LoggableValue requirements
type LoggableProps = {
  title?: string;
  onAction?: string; // Changed to string to match LoggableValue
};

// Basic component for testing logging
const LoggingTestComponentBase: React.FC<TestComponentProps> = ({
  title = "Test Component",
  onAction,
}) => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  // Use comprehensive component tracking
  const tracking = useComponentTracking("LoggingTestComponent", {
    props: { title, hasActionCallback: !!onAction },
    dependencies: [count, text],
  });

  const handleIncrement = () => {
    try {
      const newCount = count + 1;
      setCount(newCount);

      UserFlowLogger.interaction("counter_increment", "LoggingTestComponent", {
        previousValue: count,
        newValue: newCount,
      });

      if (onAction) {
        onAction({ count: newCount, text });
      }
    } catch (error) {
      console.error("Increment error:", error);
      UserFlowLogger.error("increment_error", "Failed to increment counter", {
        error,
      });
    }
  };

  const handleTextChange = (value: string) => {
    try {
      const previousText = text;
      setText(value);

      UserFlowLogger.interaction("text_input_change", "LoggingTestComponent", {
        previousText,
        newText: value,
        textLength: value.length,
      });
    } catch (error) {
      console.error("Text change error:", error);
      UserFlowLogger.error("text_change_error", "Failed to update text input", {
        error,
        value,
      });
    }
  };

  return (
    <div className="p-6 border rounded-lg max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">Counter: {count}</p>
          <Button onClick={handleIncrement} className="w-full">
            Increment Counter
          </Button>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">Text Input:</p>
          <Input
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Type something..."
            className="w-full"
          />
        </div>

        <div className="text-xs text-gray-500 mt-4 p-2 bg-gray-100 rounded">
          <p>Render Count: {tracking?.renderInfo?.renderCount || 0}</p>
          <p>
            Last Render: {tracking?.renderInfo?.timeSinceLastRender || 0}ms ago
          </p>
          {tracking?.performance && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const stats = tracking.performance?.getPerformanceStats();
                console.log("Performance Stats:", stats);
                UserFlowLogger.interaction(
                  "performance_stats_viewed",
                  "LoggingTestComponent",
                  stats,
                );
              }}
              className="mt-2"
            >
              View Performance Stats
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Converting component to have LoggableProps for HOC compatibility
const LoggingTestComponentForHOC = (props: TestComponentProps) => {
  // Convert non-loggable props to loggable ones
  const loggableProps: LoggableProps = {
    title: props.title,
    onAction: props.onAction ? "function" : undefined,
  };

  return <LoggingTestComponentBase {...props} />;
};

// Export both wrapped and unwrapped versions for testing
export const LoggingTestComponent = withDetailedLogging(
  LoggingTestComponentForHOC as React.ComponentType<LoggableProps>,
  "LoggingTestComponent",
);

export const LoggingTestComponentVerbose = withLogging(
  LoggingTestComponentForHOC as React.ComponentType<LoggableProps>,
  {
    componentName: "LoggingTestComponentVerbose",
    config: { level: "verbose" },
  },
);

export const LoggingTestComponentBasic = withLogging(
  LoggingTestComponentForHOC as React.ComponentType<LoggableProps>,
  {
    componentName: "LoggingTestComponentBasic",
    config: { level: "basic" },
  },
);

// Example of HOC usage patterns
export default LoggingTestComponent;
