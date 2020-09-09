import React, { useState } from "react";

function UseTap() {
  // useState 활용
  const content = [
    {
      tab: `Tab01`,
      desc: `This is Tab01`,
    },
    {
      tab: `Tab02`,
      desc: `This is Tab02`,
    },
  ];

  const useTabs = (initialTab, allTabs) => {
    const [currentIndex, setCurrentIndex] = useState(initialTab);
    if (!allTabs || !Array.isArray(allTabs)) {
      return;
    }
    return {
      currentItem: allTabs[currentIndex],
      changeItem: setCurrentIndex,
    };
  };

  // 탭 만들기
  const { currentItem, changeItem } = useTabs(0, content);

  return (
    <div>
      {content.map((section, index) => (
        <button onClick={() => changeItem(index)} key={index}>
          {section.tab}
        </button>
      ))}
      <p>{currentItem.desc}</p>
    </div>
  );
}

export default UseTap;
