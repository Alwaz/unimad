import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky  mb-5 top-0 z-50 w-full bg-(--glass-background) backdrop-blur-(--glass-blur) border-b border-accent-foreground/15">
      <Link
        href="/"
        className="flex px-6 lg:px-8 h-14 items-center  no-underline hover:no-underline"
      >
        <h3>Unimad</h3>
      </Link>
    </header>
  );
}
