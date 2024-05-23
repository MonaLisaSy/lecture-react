import React from "react";

export const TabType = { 
    KEYWORD: "KEYWORD",
    HISTORY: "HISTORY",
};
  
const TabLabel = {
  [TabType.KEYWORD]: "추천 검색어",
  [TabType.HISTORY]: "최근 검색어",
};
  
const Tabs = ({selectedTab, onChange }) => (
        <ul className = "tabs" >
          {Object.values(TabType).map((tabType) => (
            <li 
              className = {selectedTab === tabType ? "active" : ""} // 9. 탭이 같은지에 따라 활성화 or 비활성화 
              key = {tabType}
              onClick = {() => onChange(tabType)} // 9. 클릭시켜 selectedTab 업데이트 
            >
              {TabLabel[tabType]}
            </li>
          ))} 
        </ul>
);

  export default Tabs;