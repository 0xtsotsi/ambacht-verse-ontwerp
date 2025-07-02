#!/usr/bin/env node

/**
 * Test script for Notion API connection
 * Verifies connectivity to the Notion database for task management
 */

// Import required modules
const { Client } = require('@notionhq/client');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Database ID from project configuration
const DATABASE_ID = "21df23ab1c8f80ef914effd0d37a5b43";

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

/**
 * Test the connection to the Notion database
 */
async function testNotionConnection() {
  console.log("🔄 Testing Notion API connection...");
  console.log("=" .repeat(50));
  
  try {
    // Check if API key is configured
    if (!process.env.NOTION_API_KEY) {
      console.error("❌ ERROR: NOTION_API_KEY not found in environment variables");
      console.log("\nPlease create a .env file with the following content:");
      console.log("NOTION_API_KEY=your_integration_secret_here");
      console.log("\nOr run with:");
      console.log("NOTION_API_KEY=your_integration_secret_here node test-notion-connection.js");
      return;
    }
    
    console.log(`📊 Database ID: ${DATABASE_ID}`);
    console.log("🔑 API Key: " + process.env.NOTION_API_KEY.substring(0, 4) + "..." + process.env.NOTION_API_KEY.substring(process.env.NOTION_API_KEY.length - 4));
    
    // Attempt to query the database
    console.log("\n🔍 Querying database...");
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      page_size: 1, // Just get one record to verify access
    });
    
    // Check response
    if (response && response.results) {
      console.log("✅ SUCCESS: Connected to Notion database!");
      console.log(`📝 Found ${response.results.length} records in initial query`);
      
      // Show database metadata if available
      if (response.results.length > 0) {
        const firstPage = response.results[0];
        console.log("\n📋 Sample data from first record:");
        console.log(`  ID: ${firstPage.id}`);
        console.log(`  Created: ${firstPage.created_time}`);
        console.log(`  Last Edited: ${firstPage.last_edited_time}`);
      }
      
      // Get database schema
      console.log("\n🏗️ Retrieving database schema...");
      const dbInfo = await notion.databases.retrieve({
        database_id: DATABASE_ID,
      });
      
      console.log("📊 Database Title:", dbInfo.title[0]?.plain_text || "Untitled");
      console.log("🔧 Available Properties:");
      
      Object.entries(dbInfo.properties).forEach(([key, property]) => {
        console.log(`  - ${key} (${property.type})`);
      });
    }
  } catch (error) {
    console.error("❌ ERROR connecting to Notion:");
    
    if (error.code === 'unauthorized') {
      console.error("  Authentication failed. Check your API key.");
    } else if (error.code === 'object_not_found') {
      console.error("  Database not found. Check the database ID.");
      console.error("  Make sure your integration has access to this database.");
    } else {
      console.error(`  ${error.message}`);
    }
    
    console.log("\n🔧 TROUBLESHOOTING:");
    console.log("1. Verify your API key is correct");
    console.log("2. Ensure your integration has been added to the database");
    console.log("3. Check that the database ID is correct");
    console.log("4. Verify your IP is not being blocked by Notion");
  }
}

// Run the test
testNotionConnection()
  .then(() => {
    console.log("\n✨ Test completed");
  })
  .catch(error => {
    console.error("💥 Unhandled error:", error);
    process.exit(1);
  });
