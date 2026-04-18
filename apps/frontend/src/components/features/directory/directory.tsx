import { FilterGroup } from '@/components/features/directory/filter-group';
import { SearchBar } from '@/components/shared/search-bar';

async function Directory(
  props: Readonly<{
    searchParams?: Promise<{
      query?: string;
      page?: string;
    }>;
  }>,
) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  /*
  This directory will receive programs as props and render them in a grid. 
  Each program will be rendered as a card with the program name, university name, and a button to view details. 
  The details modal will have more details about the program, such as the program description,
  requirements, and application process.
*/

  return (
    <div className="py-5 space-y-5">
      <SearchBar />

      <FilterGroup />
      {/* <Suspense key={query + currentPage} fallback={<ProgramsSkeleton />}>
        <Programs query={query} currentPage={currentPage} />
      </Suspense> */}
      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
    </div>
  );
}

export default Directory;
