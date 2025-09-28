import React from "react";

export function HoverEffect({ items }) {
  return (
    <div className="flex flex-wrap gap-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="border-2 border-accent-orange/20 rounded-xl p-6 w-72 shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-white relative overflow-hidden"
          onClick={item.onClick}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-orange to-accent-yellow"></div>
          <h4 className="m-0 mb-2 font-bold text-gray-800 text-2xl relative z-10">
            {item.title}
          </h4>
          <p className="m-0 mb-3 text-gray-700 text-base relative z-10">
            {item.about}
          </p>
          <div className="m-0 text-gray-600 text-sm relative z-10">
            {item.description.map((line, i) => (
              <p key={i} className="m-0 mb-1">{line}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}