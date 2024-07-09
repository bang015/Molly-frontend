import React, { useEffect, useState } from "react";
import "./index.css";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  deleteSearchHistory,
  getSearchHistory,
  getSearchResult,
  resetResult,
} from "@/redux/search";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux";
import Result from "../result";
import { useLocation } from "react-router-dom";
interface searchProps {
  open: boolean;
  onClose: () => void;
}
const Search: React.FC<searchProps> = ({ open, onClose }) => {
  const location = useLocation();
  const [keyword, setKeyword] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const dispatch = useDispatch();
  const result = useSelector((state: RootState) => state.searchReducer.result);
  const history = useSelector(
    (state: RootState) => state.searchReducer.history
  );
  const token = useSelector((state: RootState) => state.authReducer.token);
  useEffect(() => {
    const search = document.querySelector(".search");
    if (!search) return;
    if (!open) {
      // 검색창이 열려있는 경우
      if (location.pathname !== "/messenger") {
        document.querySelectorAll(".text").forEach((element) => {
          element.classList.remove("hidden");
        });
        document.querySelector(".nav")?.classList.remove("sNav");
      }
      search.classList.remove("slide-in");
      search.classList.add("slide-out");
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

  useEffect(() => {
    if (token) dispatch(getSearchHistory(token) as any);
  }, [dispatch]);
  useEffect(() => {
    if (keyword === "") {
      dispatch(resetResult());
    }
  }, [keyword]);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    let keyword = e.target.value;
    const firstChar = keyword.charAt(0);
    let type;
    if (firstChar === "#") {
      type = "tag";
      keyword = keyword.slice(1);
    } else if (firstChar === "@") {
      type = "user";
      keyword = keyword.slice(1);
    } else {
      type = "all";
    }
    if (keyword !== "" && keyword !== "@" && keyword !== "#") {
      dispatch(getSearchResult({ keyword, type }) as any);
    }
  };
  const handleSearchReset = () => {
    setKeyword("");
  };

  const handleFocus = () => {
    setInputFocused(true);
  };

  const handleBlur = () => {
    setInputFocused(false);
  };
  const deleteHistory = () => {
    const history = null;
    if (token) dispatch(deleteSearchHistory({ token, history }) as any);
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
          <button type="button" onClick={handleSearchReset}>
            <CancelIcon color="disabled" sx={{ fontSize: 16 }} />
          </button>
        </div>
        <div className="sc2">
          {keyword === "" && (
            <div className="history">
              <div>최근 검색 항목</div>
              <div>
                <button onClick={deleteHistory}>모두 지우기</button>
              </div>
            </div>
          )}
          <div className="searchList">
            {keyword === "" ? (
              <>
                {history.length ? (
                  <>
                    {history.map((res, index) => (
                      <Result
                        key={index}
                        result={res}
                        onClose={onClose}
                        type="history"
                      />
                    ))}
                  </>
                ) : (
                  <div className="historyEmpty">
                    <div>최근 검색 내역 없음.</div>
                  </div>
                )}
              </>
            ) : (
              <>
                {result.map((res, index) => (
                  <Result
                    key={index}
                    result={res}
                    onClose={onClose}
                    type="result"
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Search;
