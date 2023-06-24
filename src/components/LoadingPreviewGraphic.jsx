export default function LoadingPreviewGraphic() {
  return (
    <div className="w-full h-[300px] flex items-center justify-center">
      <div>
        <svg
          className="mx-auto"
          width="110"
          height="110"
          viewBox="0 0 110 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="110" height="110" rx="8" fill="black" fill-opacity="0.19" />
        </svg>
        <svg
          className="animate-spin mx-auto -mt-20"
          width="42"
          height="42"
          viewBox="0 0 42 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_530_536)" opacity="0.4">
            <path
              d="M20.8817 8.00563C20.7559 8.00189 20.6296 8 20.5028 8C13.5977 8 8 13.5964 8 20.5C8 27.4036 13.5977 33 20.5028 33C27.2812 33 32.7997 27.6071 33 20.8788"
              stroke="white"
              stroke-width="2"
            />
            <path d="M24.0624 8.12676L19.5082 10.6285L19.6187 5.43355L24.0624 8.12676Z" fill="white" />
          </g>
          <defs>
            <clipPath id="clip0_530_536">
              <rect width="42" height="42" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
}
