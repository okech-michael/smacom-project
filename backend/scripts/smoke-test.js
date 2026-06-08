import { randomUUID } from 'crypto';

const base = 'http://localhost:4000/api';

const run = async () => {
  console.log('HEALTH');
  let res = await fetch(`${base}/health`);
  console.log(await res.json());

  const email = `smacom-test-${randomUUID()}@example.com`;
  console.log('REGISTER', email);
  res = await fetch(`${base}/auth/register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password: 'TestPass123!' }),
  });
  console.log(await res.json());

  console.log('GOOGLE LOGIN REDIRECT');
  res = await fetch(`${base}/auth/login/google?redirect_url=http://localhost:5173`, { redirect: 'manual' });
  console.log({ status: res.status, location: res.headers.get('location') });

  console.log('INVOKE LLM');
  res = await fetch(`${base}/integrations/core/invoke-llm`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ prompt: 'Test AI prompt' }),
  });
  console.log(await res.json());

  console.log('UPLOAD FILE');
  const fileForm = new FormData();
  fileForm.append('file', new Blob(['Hello SMACom upload test']), 'smacom-upload.txt');
  res = await fetch(`${base}/integrations/core/upload-file`, {
    method: 'POST',
    body: fileForm,
  });
  console.log(await res.json());

  console.log('CREATE COURSE');
  res = await fetch(`${base}/entities/Course`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      title: `Smoke Test Course ${randomUUID()}`,
      category: 'testing',
      tags: ['smoke', 'test'],
      description: 'Smoke test entity',
    }),
  });
  const course = await res.json();
  console.log(course);

  console.log('GET COURSE');
  res = await fetch(`${base}/entities/Course/${course.id}`);
  console.log(await res.json());

  console.log('APP SETTINGS');
  res = await fetch(`${base}/apps/public/prod/public-settings/by-id/test-app`);
  console.log(await res.json());
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});