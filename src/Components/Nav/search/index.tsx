import React, { useEffect, useState } from "react";
import "./index.css";
import CancelIcon from "@mui/icons-material/Cancel";
interface searchProps {
  open: boolean;
}
const Search: React.FC<searchProps> = ({ open }) => {
  const [keyword, setKeyword] = useState("");
  const [inputFocused, setInputFocused] = useState(false);

  useEffect(() => {
    const search = document.querySelector(".search");
    if (!search) return;
    if (!open) {
      // 검색창이 열려있는 경우
      search.classList.remove("slide-in");
      search.classList.add("slide-out");
      document.querySelectorAll(".text").forEach((element) => {
        element.classList.remove("hidden");
      });
      document.querySelector(".nav")?.classList.remove("sNav");
      setKeyword("");
    } else {
      // 검색창이 닫혀있는 경우
      search.classList.remove("slide-out");
      search.classList.add("slide-in");
      document.querySelectorAll(".text").forEach((element) => {
        element.classList.add("hidden");
      });
      document.querySelector(".nav")?.classList.add("sNav");
    }
  }, [open]);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };
  const handleSearchReset = () => {
    console.log(1)
    setKeyword("");
  };

  const handleFocus = () => {
    setInputFocused(true);
  };

  const handleBlur = () => {
    setInputFocused(false);
  };
  return (
    <div className="search">
      <div className="header">
        <h2>검색</h2>
      </div>
      <div className="content">
        <div className="sc1">
          <div>
            <input
              value={keyword}
              type="text"
              placeholder="검색"
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleSearch}
            />
          </div>
          {inputFocused && (
            <button type="button" onClick={handleSearchReset}>
              <CancelIcon color="disabled" sx={{ fontSize: 16 }} />
            </button>
          )}
        </div>
        <div className="sc2">
          <div>최근 검색 항목</div>
          <div className="searchList">검색 기록</div>
        </div>
      </div>
    </div>
  );
};
export default Search;
