import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for API tests
 * 
 * This setup runs once before all API tests and:
 * - Validates the API server is running
 * - Sets up authentication tokens
 * - Initializes test database state
 * - Verifies essential services are available
 */
async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('🚀 Setting up API test environment...');

  try {
    // 1. Check if API server is running
    const baseURL = config.projects[0].use.baseURL || 'http://localhost:3001/api/v1';
    const healthResponse = await page.request.get(`${baseURL}/health`);
    
    if (!healthResponse.ok()) {
      throw new Error(`API server not responding at ${baseURL}/health (Status: ${healthResponse.status()})`);
    }
    
    console.log('✅ API server is running');

    // 2. Setup authentication
    const authToken = await setupAuthentication(page, baseURL);
    process.env.API_TEST_TOKEN = authToken;
    console.log('✅ Authentication configured');

    // 3. Initialize test data
    await initializeTestData(page, baseURL, authToken);
    console.log('✅ Test data initialized');

    // 4. Verify database connections
    await verifyDatabaseConnections(page, baseURL, authToken);
    console.log('✅ Database connections verified');

    // 5. Clear any existing test data
    await cleanupPreviousTestData(page, baseURL, authToken);
    console.log('✅ Previous test data cleaned up');

  } catch (error) {
    console.error('❌ API test setup failed:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }

  console.log('🎉 API test environment ready!');
}

/**
 * Setup authentication for API tests
 */
async function setupAuthentication(page: any, baseURL: string): Promise<string> {
  const authResponse = await page.request.post(`${baseURL}/auth/test-token`, {
    data: {
      email: 'test@wesleysambacht.nl',
      role: 'admin',
      permissions: ['read', 'write', 'admin']
    }
  });

  if (!authResponse.ok()) {
    throw new Error(`Failed to get test authentication token: ${authResponse.status()}`);
  }

  const authData = await authResponse.json();
  return authData.access_token;
}

/**
 * Initialize test data needed for API tests
 */
async function initializeTestData(page: any, baseURL: string, token: string) {
  const headers = { 'Authorization': `Bearer ${token}` };

  // Create test availability slots
  await page.request.post(`${baseURL}/admin/availability/seed-test-data`, {
    headers,
    data: {
      dateRange: {
        start: new Date().toISOString().split('T')[0],
        end: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      timeSlots: ['10:00', '14:00', '18:00'],
      maxBookings: 3
    }
  });

  // Create test add-on services
  await page.request.post(`${baseURL}/admin/add-on-services/seed-test-data`, {
    headers,
    data: {
      categories: ['beverages', 'equipment', 'staff', 'entertainment']
    }
  });

  // Create test service tiers and pricing
  await page.request.post(`${baseURL}/admin/pricing/seed-test-data`, {
    headers,
    data: {
      serviceTiers: ['essential', 'premium', 'luxury'],
      serviceCategories: ['corporate', 'private', 'wedding', 'celebration']
    }
  });
}

/**
 * Verify database connections are working
 */
async function verifyDatabaseConnections(page: any, baseURL: string, token: string) {
  const headers = { 'Authorization': `Bearer ${token}` };
  
  // Test read operations
  const availabilityResponse = await page.request.get(`${baseURL}/availability`, { headers });
  if (!availabilityResponse.ok()) {
    throw new Error('Database read test failed');
  }

  // Test write operations
  const testBookingResponse = await page.request.post(`${baseURL}/bookings/test-connection`, {
    headers,
    data: { connectionTest: true }
  });
  if (!testBookingResponse.ok()) {
    throw new Error('Database write test failed');
  }
}

/**
 * Clean up any leftover data from previous test runs
 */
async function cleanupPreviousTestData(page: any, baseURL: string, token: string) {
  const headers = { 'Authorization': `Bearer ${token}` };
  
  // Clean up test bookings
  await page.request.delete(`${baseURL}/admin/test-data/bookings`, { headers });
  
  // Clean up test quotes
  await page.request.delete(`${baseURL}/admin/test-data/quotes`, { headers });
  
  // Reset availability counters
  await page.request.post(`${baseURL}/admin/availability/reset-test-counters`, { headers });
}

export default globalSetup;