import usa from "../assets/us.png";
import uk from "../assets/uk.png";
import { useState } from "react";
const Footer = () => {
  const [flag, setFlag] = useState(false);

  const handleFlag = () => {
    setFlag(!flag);
  };
  return (
    <footer className="body-font bg-black bg-opacity-90 w-full text-white pt-14 px-4 md:px-8">
      <div className="flex w-full justify-evenly pb-12">
        <div className="flex-grow flex flex-wrap md:pr-20 w-full justify-evenly  text-center order-first">
          {/* Link list 1*/}
          <div className="lg:w-1/4 md:w-1/2 w-full px-4 items-center justify-center">
            {/* Heading 1 */}
            <h2 className="title-font font-medium text-white tracking-widest mb-3">
              Products
            </h2>

            {/* List 1 */}
            <nav className="list-none mb-10 flex flex-col gap-3 text-sm ">
              <li>
                <a href="/payment" className="text-gray-400 cursor-pointer hover:text-gray-500">
                  Payments
                </a>
              </li>
              <li>
                <a className="text-gray-400 cursor-pointer hover:text-gray-500">
                  Fleet management 
                </a>
              </li>
              <li>
                <a href="/tokenization" className="text-gray-400 cursor-pointer hover:text-gray-500">
                  personal assets and busines transit
                </a>
              </li>
              <li>
                <a href="/clearing-settlement" className="text-gray-400 cursor-pointer hover:text-gray-500">
                  Clearing and settlements
                </a>
              </li>
              <li>
                <a href="/clearing-settlement" className="text-gray-400 cursor-pointer hover:text-gray-500">
                  asset live broad casting video stream
                </a>
              </li>
              <li>
                <a href="/payment-gateway" className="text-gray-400 cursor-pointer hover:text-gray-500">
                  Assets in transit
                </a>
              </li>
            </nav>
          </div>

          {/* Link list 2 */}
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
           {/* Heading 2 */}
           <h2 className="title-font font-medium text-white tracking-widest mb-3">
              Company
            </h2>
            <nav className="list-none mb-10 flex flex-col gap-3 text-sm ">
              <li>
                <a href="/about" className="hover:text-gray-500 text-gray-400">
                  About
                </a>
              </li>
            </nav>
          </div>

          {/* Link list 3 */}
          <div className="lg:w-1/4 md:w-1/2 w-full">
            {/* Heading 3 */}
            <h2 className="title-font font-medium text-white tracking-widest mb-3">
              Legal Information
            </h2>
            <nav className="list-none mb-10 flex flex-col gap-3 text-sm ">
              <li>
                <a href="/aml-ctf" className="hover:text-gray-500 text-gray-400">
                  AML/CTF
                </a>
              </li>
            </nav>
          </div>
        </div>
      </div>

      {/* Change Language & Access account button bar */}
      <div className=" w-full justify-between flex border-t pt-8 border-gray-600 md:flex-row flex-col-reverse gap-3 pb-12 items-center px-8 lg:px-20">
        <div className="text-gray-500 font-bold text-sm gap-2 text-center flex items-center sm:text-left">
          {/* Choose country */}
          <div className="flex gap-2 items-center border-gray-500 rounded-full p-1 border">
            {flag ? (
              <div className="w-8 h-8">
                <img src={usa} className="object-cover" />
              </div>
            ) : (
              <div className="w-8 h-8">
                <img src={uk} className="object-cover" />
              </div>
            )}
            <select className=" outline-none bg-inherit cursor-pointer">
              <option onClick={handleFlag}>UK</option>
              <option onClick={handleFlag}>US</option>
            </select>
          </div>

          {/* Choose Language */}
          <div className="flex gap-2 items-center border-gray-500 rounded-full p-1 border">
            <div className="w-8 h-8 items-center justify-center flex">
              <svg fill="white" viewBox="0 0 16 16" height="2em" width="2em">
                <path d="M0 8a8 8 0 1116 0A8 8 0 010 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855-.143.268-.276.56-.395.872.705.157 1.472.257 2.282.287V1.077zM4.249 3.539c.142-.384.304-.744.481-1.078a6.7 6.7 0 01.597-.933A7.01 7.01 0 003.051 3.05c.362.184.763.349 1.198.49zM3.509 7.5c.036-1.07.188-2.087.436-3.008a9.124 9.124 0 01-1.565-.667A6.964 6.964 0 001.018 7.5h2.49zm1.4-2.741a12.344 12.344 0 00-.4 2.741H7.5V5.091c-.91-.03-1.783-.145-2.591-.332zM8.5 5.09V7.5h2.99a12.342 12.342 0 00-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5c.035.987.176 1.914.399 2.741A13.612 13.612 0 017.5 10.91V8.5H4.51zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741H8.5zm-3.282 3.696c.12.312.252.604.395.872.552 1.035 1.218 1.65 1.887 1.855V11.91c-.81.03-1.577.13-2.282.287zm.11 2.276a6.696 6.696 0 01-.598-.933 8.853 8.853 0 01-.481-1.079 8.38 8.38 0 00-1.198.49 7.01 7.01 0 002.276 1.522zm-1.383-2.964A13.36 13.36 0 013.508 8.5h-2.49a6.963 6.963 0 001.362 3.675c.47-.258.995-.482 1.565-.667zm6.728 2.964a7.009 7.009 0 002.275-1.521 8.376 8.376 0 00-1.197-.49 8.853 8.853 0 01-.481 1.078 6.688 6.688 0 01-.597.933zM8.5 11.909v3.014c.67-.204 1.335-.82 1.887-1.855.143-.268.276-.56.395-.872A12.63 12.63 0 008.5 11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.963 6.963 0 0014.982 8.5h-2.49a13.36 13.36 0 01-.437 3.008zM14.982 7.5a6.963 6.963 0 00-1.362-3.675c-.47.258-.995.482-1.565.667.248.92.4 1.938.437 3.008h2.49zM11.27 2.461c.177.334.339.694.482 1.078a8.368 8.368 0 001.196-.49 7.01 7.01 0 00-2.275-1.52c.218.283.418.597.597.932zm-.488 1.343a7.765 7.765 0 00-.395-.872C9.835 1.897 9.17 1.282 8.5 1.077V4.09c.81-.03 1.577-.13 2.282-.287z" />
              </svg>
            </div>
            <select className=" outline-none bg-inherit cursor-pointer">
              <option>EN</option>
            </select>
          </div>
        </div>

        {/* Access Account button */}
        <div className="flex">
          <a href="https://dy2n4ci8i4d.typeform.com/to/TJgNtJit" className=" text-white border hover:bg-black bg-[#202020] px-4 py-2 rounded-2xl">
            Access your account
          </a>
        </div>
      </div>

      {/* Bottom Paragraph */}
      <div className="flex w-full px-8 lg:px-20 text-gray-500 text-center md:text-left pb-10">
        <p>
          It&#39;s important to note that while an asset is in a remote area gps services my not work as expected but the moments its in a network area the the gps tracker will broat cast its loction with last 48hour journey.  </p>
      </div>
    </footer>
  );
};

export default Footer;
