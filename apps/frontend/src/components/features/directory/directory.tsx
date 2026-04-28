import { FilterGroup } from '@/components/features/directory/filter-group';
import { SearchBar } from '@/components/shared/search-bar';
import { programsService } from '@/services/programs.service';
import type { SearchParams } from '@repo/shared';
import Pagination from './pagination';
import ProgramCard from './program-card';

async function Directory({ searchParams }: Readonly<{ searchParams?: SearchParams }>) {
  const {
    items: programs,
    totalCount,
    currentPage,
    pageCount,
  } = await programsService.getPrograms(searchParams);

  return (
    <div className="py-5 space-y-5">
      <SearchBar />
      <FilterGroup />
      <p className="flex justify-end text-sm  text-on-surface-variant">
        Showing {programs.length} of {totalCount} programs | Page {currentPage} of {pageCount}
      </p>

      {programs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-2">
          <p className="text-xl font-semibold text-on-surface">No programs found</p>
          <p className="text-sm text-on-surface-variant">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      )}

      <div className="mt-5 flex w-full justify-center">
        <Pagination />
      </div>
    </div>
  );
}

export default Directory;
