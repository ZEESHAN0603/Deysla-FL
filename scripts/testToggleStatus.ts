import { handleAdminApiRequest } from '../src/server/adminApiHandler.ts';
import { generateToken } from '../src/server/auth.ts';

async function run() {
  console.log('--- Testing Product Status Toggle Roundtrip ---');
  const token = generateToken('admin');
  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const productId = '189156'; // CCTV1

  // 1. Initial State Check
  console.log('1. Checking initial state of CCTV1...');
  const resInit = await handleAdminApiRequest(new Request('http://localhost:3000/api/catalog?includeInactive=true', { method: 'GET' }));
  const dataInit = await resInit.json();
  const prodInit = dataInit.products.find((p: any) => p.id === productId);
  console.log('   Initial status:', prodInit?.status);

  // 2. Toggle to Active
  console.log('2. Toggling CCTV1 to "active"...');
  const toggleReq1 = new Request(`http://localhost:3000/api/admin/products/${productId}/toggle-status`, {
    method: 'POST',
    headers: authHeaders,
  });
  const toggleRes1 = await handleAdminApiRequest(toggleReq1);
  const toggleData1 = await toggleRes1.json();
  console.log('   Toggle response success:', toggleData1.success, 'new status:', toggleData1.product?.status);

  // Verify refetch
  const resAfter1 = await handleAdminApiRequest(new Request('http://localhost:3000/api/catalog?includeInactive=true', { method: 'GET' }));
  const dataAfter1 = await resAfter1.json();
  const prodAfter1 = dataAfter1.products.find((p: any) => p.id === productId);
  console.log('   Refetched CCTV1 status:', prodAfter1?.status);

  if (prodAfter1?.status !== 'active') {
    throw new Error('Expected CCTV1 to be active after toggle!');
  }

  // 3. Toggle back to Inactive (Restoring original state)
  console.log('3. Toggling CCTV1 back to "inactive" to preserve original state...');
  const toggleReq2 = new Request(`http://localhost:3000/api/admin/products/${productId}/toggle-status`, {
    method: 'POST',
    headers: authHeaders,
  });
  const toggleRes2 = await handleAdminApiRequest(toggleReq2);
  const toggleData2 = await toggleRes2.json();
  console.log('   Toggle response success:', toggleData2.success, 'restored status:', toggleData2.product?.status);

  // Verify refetch after restoring
  const resAfter2 = await handleAdminApiRequest(new Request('http://localhost:3000/api/catalog?includeInactive=true', { method: 'GET' }));
  const dataAfter2 = await resAfter2.json();
  const prodAfter2 = dataAfter2.products.find((p: any) => p.id === productId);
  console.log('   Final refetched CCTV1 status:', prodAfter2?.status);

  if (prodAfter2?.status !== 'inactive') {
    throw new Error('Expected CCTV1 to be restored to inactive!');
  }

  console.log('SUCCESS: Full MySQL persistence and status toggle verified. CCTV1 remains inactive.');
  process.exit(0);
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
