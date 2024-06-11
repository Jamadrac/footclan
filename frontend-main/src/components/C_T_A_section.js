const C_T_A_section = () => {
  return (
    <div>
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-black bg-opacity-90 pt-16 shadow-2xl sm:rounded-3xl md:pt-24 lg:flex lg:gap-x-20 lg:pt-0">
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
              aria-hidden="true"
            >
              <circle
                cx="512"
                cy="512"
                r="512"
                fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
                fillOpacity="0.7"
              />
              <defs>
                <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                  <stop stopColor="#7775D6" />
                  <stop offset="1" stopColor="#fbd125" />
                </radialGradient>
              </defs>
            </svg>
            <div className="grid md:grid-cols-2 grid-cols-1">
              <div className="flex items-center md:items-start md:p-12 w-full flex-col justify-center md:mb-0 mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  bolder, biger and reliable.
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  stay at peace knowing that you are secure .
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                  <a
                    href="#"
                    className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-indigo-600 hover:text-white transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Get started
                  </a>
                  <a
                    href="#"
                    className="text-sm font-semibold leading-6 text-white"
                  >
                    Learn more <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
              <div className="flex w-full items-center justify-center bg-red-500">
                <img
                  className="w-full h-full"
                  src="../../../../src/assets/a (1).avif"
                  alt="App screenshot"
                  width="1824"
                  height="1080"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default C_T_A_section;
