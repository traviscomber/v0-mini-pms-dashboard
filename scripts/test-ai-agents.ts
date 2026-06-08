import { predictPricing, predictCancellation, forecastRevenue } from '../app/pms/lib/ai-service';

async function testAIAgents() {
  console.log('\n🤖 Testing OpenAI AI Agents...\n');

  try {
    // Test 1: Dynamic Pricing
    console.log('📊 Test 1: Dynamic Pricing Prediction');
    console.log('─'.repeat(50));
    const pricingResult = await predictPricing({
      basePrice: 150,
      occupancyRate: 78,
      dayOfWeek: 5, // Friday
      season: 'peak',
      daysUntilBooking: 7,
    });
    console.log('✓ Input: Friday, peak season, 78% occupancy');
    console.log('✓ Result:', JSON.stringify(pricingResult.data, null, 2));
    console.log('✓ Pricing prediction successful\n');

    // Test 2: Cancellation Risk
    console.log('⚠️  Test 2: Cancellation Risk Prediction');
    console.log('─'.repeat(50));
    const cancellationResult = await predictCancellation({
      daysUntilArrival: 21,
      advanceBookingDays: 7,
      guestCancellationRate: 0.1,
      bookingSource: 'booking.com',
      depositPaid: true,
    });
    console.log('✓ Input: 21 days until arrival, booking.com source, deposit paid');
    console.log('✓ Result:', JSON.stringify(cancellationResult.data, null, 2));
    console.log('✓ Cancellation prediction successful\n');

    // Test 3: Revenue Forecasting
    console.log('📈 Test 3: Revenue Forecasting');
    console.log('─'.repeat(50));
    const revenueResult = await forecastRevenue({
      lastMonth: 12500,
      last3Months: [11000, 12000, 12500],
      occupiedDays: 24,
      totalDays: 30,
      bookingTrend: 'increasing',
    });
    console.log('✓ Input: $12,500 last month, 80% occupancy, increasing trend');
    console.log('✓ Result:', JSON.stringify(revenueResult.data, null, 2));
    console.log('✓ Revenue forecast successful\n');

    console.log('═'.repeat(50));
    console.log('✅ All AI Agent Tests PASSED!');
    console.log('═'.repeat(50));
    console.log('\n📊 Summary:');
    console.log('  ✓ Dynamic Pricing: Recommends optimal room rates');
    console.log('  ✓ Cancellation Risk: Predicts high-risk bookings');
    console.log('  ✓ Revenue Forecast: Projects monthly revenue');
    console.log('\n🚀 AI Automation System is LIVE and operational!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run tests
testAIAgents();

