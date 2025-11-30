const base = 'http://localhost:4000/api/subscriptions';

async function run(): Promise<void> {
  console.log('Testing API at', base);

  // 1. Create (valid)
  const createRes = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'TEST-SERVICE',
      price: 5.5,
      currency: 'USD',
      frequency: 'monthly',
      payment_date: new Date().toISOString(),
    }),
  });
  const created = await createRes.json();
  console.log('Created:', created);

  // 2. List
  const list = await (await fetch(base)).json();
  console.log('List count:', Array.isArray(list) ? list.length : list);

  // 3. Update
  const id = (created as any).id;
  const updRes = await fetch(`${base}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'TEST-SERVICE-UPDATED' }),
  });
  const updated = await updRes.json();
  console.log('Updated:', updated);

  // 4. Delete
  const del = await fetch(`${base}/${id}`, { method: 'DELETE' });
  console.log('Delete status:', del.status);

  const finalList = await (await fetch(base)).json();
  console.log('Final count:', Array.isArray(finalList) ? finalList.length : finalList);

  // 5. Try invalid create (missing price)
  const invalidRes = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: '', currency: 'USD', frequency: 'monthly' }),
  });
  console.log('Invalid create status:', invalidRes.status);
  const invalidBody = await invalidRes.text();
  console.log('Invalid create response:', invalidBody);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
