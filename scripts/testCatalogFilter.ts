import { handleAdminApiRequest } from '../src/server/adminApiHandler.ts';

async function run() {
  console.log('--- Testing /api/catalog filter behavior ---');
  // Test 1: Public request
  const req1 = new Request('http://localhost:3000/api/catalog', { method: 'GET' });
  const res1 = await handleAdminApiRequest(req1);
  const data1 = await res1.json();
  console.log('1. Public catalog total products:', data1.products?.length);
  const cctv1Public = data1.products?.find((p: any) => p.id === '189156' || p.name === 'CCTV1');
  console.log('   CCTV1 in public catalog:', !!cctv1Public ? 'VISIBLE (unexpected)' : 'HIDDEN (correct)');

  // Test 2: Admin / includeInactive request
  const req2 = new Request('http://localhost:3000/api/catalog?includeInactive=true', { method: 'GET' });
  const res2 = await handleAdminApiRequest(req2);
  const data2 = await res2.json();
  console.log('2. includeInactive total products:', data2.products?.length);
  const cctv1Admin = data2.products?.find((p: any) => p.id === '189156' || p.name === 'CCTV1');
  console.log('   CCTV1 in includeInactive catalog:', !!cctv1Admin ? 'FOUND (correct)' : 'NOT FOUND (failed)');
  console.log('   CCTV1 details:', cctv1Admin ? { id: cctv1Admin.id, name: cctv1Admin.name, status: cctv1Admin.status } : null);

  const inactiveProducts = data2.products?.filter((p: any) => p.status === 'inactive');
  console.log('3. Inactive products count:', inactiveProducts?.length);
  inactiveProducts?.forEach((p: any) => console.log(`   - [${p.status}] ${p.id} (${p.name})`));

  const activeProducts = data2.products?.filter((p: any) => p.status !== 'inactive');
  console.log('4. Active products count:', activeProducts?.length);

  // Test 5: Verify filter counts
  console.log('5. Summary:');
  console.log(`   All Statuses count: ${data2.products?.length} (expected 35)`);
  console.log(`   Active Only count: ${activeProducts?.length} (expected 31)`);
  console.log(`   Inactive Only count: ${inactiveProducts?.length} (expected 4)`);

  process.exit(0);
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
