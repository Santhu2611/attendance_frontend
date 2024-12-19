import React from "react";
import { FaCircleNotch } from "react-icons/fa";

export default function Loader({ loader, text }) {
  return (
    <>
      {loader ? (
        <div
          id="defaultModal"
          tabindex="-1"
          className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-full md:h-full inset-0 lg:h-full lg:inset-0  justify-center items-center flex"
          aria-modal="true"
          role="dialog"
        >
          <div className="flex flex-col items-center justify-center absolute top-0 bottom-0 right-0 left-0 z-50">
            {/* <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-gray-900"></div>
            </div> */}

            <div className="flex items-center justify-center">
              <FaCircleNotch className="text-primary animate-spin text-4xl" />
            </div>

            <p>{text ?? "Uploading..."}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
