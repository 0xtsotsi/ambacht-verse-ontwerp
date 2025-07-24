/**
 * Service Tier Demo Component - Test page for the tier system
 * Used for quick testing and validation of the implementation
 */

import React, { useState } from "react";
import { ServiceTierSystem } from "./ServiceTierSystem";
import { SERVICE_CATEGORIES } from "@/lib/pricing-constants";

export const ServiceTierDemo: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(
    SERVICE_CATEGORIES[0],
  );
  const [selectedTier, setSelectedTier] = useState("essential");
  const [guestCount, setGuestCount] = useState(50);
  const [currentPrice, setCurrentPrice] = useState(0);

  const handleTierChange = (tierId: string) => {
    setSelectedTier(tierId);
    console.log("Tier changed to:", tierId);
  };

  const handlePriceUpdate = (price: number) => {
    setCurrentPrice(price);
    console.log("Price updated to:", price);
  };

  return (
    <div className="min-h-screen bg-warm-cream p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-serif text-forest-green">
            Service Tier System Demo
          </h1>
          <p className="text-natural-brown">
            Task_002_2: Interactive 3-tier service options implementation
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
          <h2 className="text-xl font-serif text-forest-green">
            Demo Controls
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Service Category Selector */}
            <div>
              <label className="block text-sm font-medium text-forest-green mb-2">
                Service Category
              </label>
              <select
                value={selectedCategory.id}
                onChange={(e) => {
                  const category = SERVICE_CATEGORIES.find(
                    (c) => c.id === e.target.value,
                  );
                  if (category) setSelectedCategory(category);
                }}
                className="w-full p-2 border border-beige rounded-lg focus:border-accent"
              >
                {SERVICE_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Guest Count */}
            <div>
              <label className="block text-sm font-medium text-forest-green mb-2">
                Guest Count
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
                className="w-full p-2 border border-beige rounded-lg focus:border-accent"
              />
            </div>

            {/* Current Selection Display */}
            <div>
              <label className="block text-sm font-medium text-forest-green mb-2">
                Current Selection
              </label>
              <div className="p-2 bg-accent/10 rounded-lg">
                <div className="text-sm text-forest-green">
                  <div>
                    Tier: <span className="font-medium">{selectedTier}</span>
                  </div>
                  <div>
                    Price:{" "}
                    <span className="font-medium">
                      €{currentPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Tier System */}
        <ServiceTierSystem
          onTierChange={handleTierChange}
          onPriceUpdate={handlePriceUpdate}
          initialServiceCategory={selectedCategory}
          selectedTier={selectedTier}
          guestCount={guestCount}
        />

        {/* Debug Information */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-gray-100 p-4 rounded-lg text-xs font-mono">
            <h3 className="font-bold mb-2">Debug Info:</h3>
            <pre>
              {JSON.stringify(
                {
                  selectedCategory: selectedCategory.name,
                  selectedTier,
                  guestCount,
                  currentPrice,
                  timestamp: new Date().toISOString(),
                },
                null,
                2,
              )}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
