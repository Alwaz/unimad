import { FilterGroup } from '@/components/features/directory/filter-group';
import { SearchBar } from '@/components/shared/search-bar';
import { PROGRAMS } from '@/lib/constants';
import type { SearchParams } from '@repo/shared';
import ProgramCard from './program-card';

async function Directory({ searchParams }: Readonly<{ searchParams?: SearchParams }>) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const filteredPrograms = PROGRAMS.filter((program) => {
    if (searchParams?.query) {
      const q = searchParams.query.toLowerCase();
      const matchesQuery =
        program?.name.toLowerCase().includes(q) ||
        program?.university?.short_name?.toLowerCase()?.includes(q) ||
        program?.university?.full_name?.toLowerCase().includes(q) ||
        program?.university?.city?.toLowerCase().includes(q);
      if (!matchesQuery) return false;
    }

    if (searchParams?.degree && program?.program_meta?.degree !== searchParams.degree) return false;
    if (searchParams?.mode && program.program_meta.mode !== searchParams.mode) return false;
    if (searchParams?.programs && program?.program_slug !== searchParams?.programs) return false;

    return true;
  });

  /*
programs returned by this API would be sorted by application deadline in ascending order, 
so that programs with nearest deadlines are shown first. 
This is just a placeholder API call, 
replace it with actual API call to fetch programs based on searchParams
  const programs = await getPrograms(searchParams);
*/

  return (
    <div className="py-5 space-y-5">
      <SearchBar />
      <FilterGroup />
      <p className="flex justify-end text-sm  text-on-surface-variant">
        {/* TODO: replace hardcoded values with dynamic ones */}
        {/* total */}
        Showing {filteredPrograms.length} of {PROGRAMS.length} programs | Page {currentPage} of
        4,229
      </p>

      {/* <Suspense key={query + currentPage} fallback={<ProgramsSkeleton />}> */}
      {/* map through all PROGRAMS from contants and for each program render a Program component, pass program as prop */}
      {/* grid layout with 3 columns on web one col on mobile */}
      {filteredPrograms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-2">
          <p className="text-xl font-semibold text-on-surface">No programs found</p>
          <p className="text-sm text-on-surface-variant">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPrograms.map((program, idx) => (
            <ProgramCard key={`${program.program_slug}${idx}`} program={program} />
          ))}
        </div>
      )}

      {/* </Suspense> */}

      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
    </div>
  );
}

export default Directory;
