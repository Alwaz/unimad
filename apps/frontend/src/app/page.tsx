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

import Directory from '@/components/features/directory/directory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TAB_VALUES } from '@/lib/constants';

export default async function Home() {
  /*
  Programs should accept filters as query params, 
  so we can pass the search query from the search bar to the directory page 
  and fetch the filtered programs. 
  We can also implement pagination and pass the page number as a query param.
filters should be url based so that we can share the filtered results with others 
and also so that we can bookmark the filtered results.

*/

  // const programs = await getPrograms();

  return (
    <main className=" space-y-5">
      <h1 className="text-5xl font-display font-semibold tracking-tight text-foreground">
        Discover your <span className="italic  text-muted-foreground">academic future.</span>
      </h1>

      <Tabs defaultValue={TAB_VALUES.DIRECTORY}>
        <TabsList variant="default" className="w-full">
          <TabsTrigger value={TAB_VALUES.DIRECTORY} className=" text-base">
            Browse Programs
          </TabsTrigger>
          <TabsTrigger value={TAB_VALUES.COMPARE} className=" text-base">
            Compare
          </TabsTrigger>
        </TabsList>

        <TabsContent value={TAB_VALUES.DIRECTORY}>
          <Directory />
        </TabsContent>
        <TabsContent value={TAB_VALUES.COMPARE}>
          <p>Compare</p>
        </TabsContent>
      </Tabs>
    </main>
  );
}
