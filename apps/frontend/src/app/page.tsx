// async function getHealthStatus(): Promise<HealthCheckResponse | null> {
//   try {
//     const res = await fetch(
//       `${process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000/api/v1'}/health`,
//       { cache: 'no-store' },
//     );
//     return res.json() as Promise<HealthCheckResponse>;
//   } catch {
//     return null;
//   }
// }

export default async function Home() {
  // const health = await getHealthStatus();

  return (
    <main>
      <h1 className="text-5xl font-display font-semibold tracking-tight text-foreground">
        Discover your <span className="italic  text-muted-foreground">academic future.</span>
      </h1>
    </main>
  );
}
