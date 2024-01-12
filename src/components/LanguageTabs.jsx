import { Link } from 'react-router-dom';

export default function LanguageTabs({ containerName }) {
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      class="h-9 items-center justify-center rounded-lg bg-ui-active p-1 text-white grid w-full grid-cols-3"
      tabindex="0"
      data-orientation="horizontal"
      style={{ outline: 'currentcolor' }}
    >
      <Link
        to="/audio-english"
        role="tab"
        aria-selected="true"
        data-state={containerName === 'audio-english' ? 'active' : 'inactive'}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-ui-base data-[state=active]:text-foreground data-[state=active]:shadow"
      >
        🇬🇧 English
      </Link>
      <Link
        to="/audio-french"
        role="tab"
        aria-selected="false"
        aria-controls="radix-:r1n:-content-password"
        data-state={containerName === 'audio-french' ? 'active' : 'inactive'}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-ui-base data-[state=active]:text-foreground data-[state=active]:shadow"
      >
        🇫🇷 French
      </Link>
      <Link
        to="/audio-ukrainian"
        role="tab"
        aria-selected="false"
        data-state={containerName === 'audio-ukrainian' ? 'active' : 'inactive'}
        id="radix-:r1n:-trigger-password"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-ui-base data-[state=active]:text-foreground data-[state=active]:shadow"
      >
        🇺🇦 Ukrainian
      </Link>
    </div>
  );
}
