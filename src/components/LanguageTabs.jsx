export default function LanguageTabs() {
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      class="h-9 items-center justify-center rounded-lg bg-ui-active p-1 text-white grid w-full grid-cols-3"
      tabindex="0"
      data-orientation="horizontal"
      style={{ outline: 'currentcolor' }}
    >
      <button
        type="button"
        role="tab"
        aria-selected="true"
        aria-controls="radix-:r1n:-content-account"
        data-state="active"
        id="radix-:r1n:-trigger-account"
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-ui-base data-[state=active]:text-foreground data-[state=active]:shadow"
        tabindex="-1"
        data-orientation="horizontal"
        data-radix-collection-item=""
      >
        🇬🇧 English
      </button>
      <button
        type="button"
        role="tab"
        aria-selected="false"
        aria-controls="radix-:r1n:-content-password"
        data-state="inactive"
        id="radix-:r1n:-trigger-password"
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
        tabindex="-1"
        data-orientation="horizontal"
        data-radix-collection-item=""
      >
        🇫🇷 French
      </button>
      <button
        type="button"
        role="tab"
        aria-selected="false"
        aria-controls="radix-:r1n:-content-password"
        data-state="inactive"
        id="radix-:r1n:-trigger-password"
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
        tabindex="-1"
        data-orientation="horizontal"
        data-radix-collection-item=""
      >
        🇺🇦 Ukranian
      </button>
    </div>
  );
}
