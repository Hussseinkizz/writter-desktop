import React, { useState } from "react";

interface Props {
  tab1Title: string;
  tab1Content: React.ReactNode;
  tab2Title: string;
  tab2Content: React.ReactNode;
}

export const CustomTabs = (props: Props) => {
  const [activeTab, setActiveTab] = useState(props.tab1Title);

  return (
    <section className="flex w-full flex-col items-start justify-start gap-4">
      {/* The Tab Triggers */}
      <div className="flex w-full items-center justify-between gap-4">
        <button
          className={`_hover-styles w-full border-b-2  pb-2 font-semibold capitalize hover:text-green-500 ${
            activeTab === props.tab1Title
              ? "border-green-500 text-green-500"
              : "border-gray-300 text-gray-500"
          }`}
          onClick={() => setActiveTab(props.tab1Title)}
        >
          {props.tab1Title}
        </button>
        <button
          className={`_hover-styles w-full border-b-2  pb-2 font-semibold capitalize hover:text-green-500 ${
            activeTab === props.tab2Title
              ? "border-green-500 text-green-500"
              : "border-gray-300 text-gray-500"
          }`}
          onClick={() => setActiveTab(props.tab2Title)}
        >
          {props.tab2Title}
        </button>
      </div>
      {/* The Tab Contents */}
      <div className="flex w-full">
        {activeTab === props.tab1Title ? props.tab1Content : props.tab2Content}
      </div>
    </section>
  );
};
