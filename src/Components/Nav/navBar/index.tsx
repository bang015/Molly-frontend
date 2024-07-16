import React, { useState, useEffect, useRef } from "react";
import {
  Avatar,
  Badge,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Logo from "@/icons/molly-logo.svg?react";
import SmallLogo from "@/icons/molly-small-logo.svg?react";
import HomeIcon from "@mui/icons-material/Home";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ExploreIcon from "@mui/icons-material/Explore";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import EmailIcon from "@mui/icons-material/Email";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux";
import "./index.css";
import { signOut } from "@/redux/auth";
import Search from "@/components/nav/search/search";
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "@/redux/auth";
import { clearPostList } from "@/redux/postList";
import { openModal } from "@/redux/modal";
const Nav: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const {user, accessToken} = useSelector((state: RootState) => state.authReducer);
  const [searchOpen, setSearchOpen] = useState(false);
  const [_message, set_message] = useState(0);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (location.pathname === "/messenger") {
      document.querySelectorAll(".text").forEach((element) => {
        element.classList.add("hidden");
      });
      document.querySelector(".nav")?.classList.add("sNav");
    } else {
      document.querySelectorAll(".text").forEach((element) => {
        element.classList.remove("hidden");
      });
      document.querySelector(".nav")?.classList.remove("sNav");
    }
  }, [location.pathname]);
  useEffect(() => {
    if (socket) {
      socket.emit("getNotReadMessage", accessToken);
      socket.on("allNotReadMessage", (data) => {
        set_message(data);
      });
      socket.on("newMessage", (data) => {
        if (data.user.cUsers.id === user?.id && socket) {
          socket.emit("getNotReadMessage", accessToken);
        }
      });
    }
  }, [socket, accessToken]);
  const handleSignOut = () => {
    dispatch(clearPostList());
    dispatch(signOut() as any);
  };
  const handleOpenSearch = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setSearchOpen((prevState) => !prevState);
  };
  const handleCloseSearch = () => {
    setSearchOpen(false);
  };

  return (
    <div className="nav-container">
      <div className="n">
        <div className="nav">
          <div className="nav-logo">
            {searchOpen || location.pathname === "/messenger" ? (
              <SmallLogo width={40} />
            ) : (
              <Logo width={110} />
            )}
          </div>
          <div className="nav-menu">
            <ListItemButton
              className={location.pathname === "/" ? "activeTab" : ""}
              style={{ borderRadius: "12px" }}
              component="a"
              onClick={() => {
                navigate("/");
              }}
            >
              <ListItemIcon>
                {location.pathname === "/" ? (
                  <HomeIcon sx={{ fontSize: 30, color: "black" }} />
                ) : (
                  <HomeOutlinedIcon sx={{ fontSize: 30, color: "black" }} />
                )}
              </ListItemIcon>
              <ListItemText className="text" primary="Home" />
            </ListItemButton>
            <ListItemButton
              style={{ borderRadius: "12px" }}
              component="a"
              onClick={(e) => {
                handleOpenSearch(e);
              }}
            >
              <ListItemIcon>
                <SearchIcon sx={{ fontSize: 30, color: "black" }} />
              </ListItemIcon>
              <ListItemText className="text" primary="Search" />
            </ListItemButton>
            <ListItemButton
              className={location.pathname === "/explore" ? "activeTab" : ""}
              style={{ borderRadius: "12px" }}
              component="a"
              onClick={() => {
                navigate("/explore");
              }}
            >
              <ListItemIcon>
                {location.pathname === "/explore" ? (
                  <ExploreIcon sx={{ fontSize: 30, color: "black" }} />
                ) : (
                  <ExploreOutlinedIcon sx={{ fontSize: 30, color: "black" }} />
                )}
              </ListItemIcon>
              <ListItemText className="text" primary="Explore" />
            </ListItemButton>
            <ListItemButton
              style={{ borderRadius: "12px" }}
              component="a"
              onClick={() => {
                navigate("/messenger");
              }}
            >
              <ListItemIcon>
                <Badge badgeContent={_message} color="primary">
                  {location.pathname === "/messenger" ? (
                    <EmailIcon sx={{ fontSize: 30, color: "black" }} />
                  ) : (
                    <EmailOutlinedIcon sx={{ fontSize: 30, color: "black" }} />
                  )}
                </Badge>
              </ListItemIcon>
              <ListItemText className="text" primary="Messages" />
            </ListItemButton>
            <ListItemButton
              style={{ borderRadius: "12px" }}
              component="a"
              onClick={() => {
                dispatch(
                  openModal({
                    modalType: "PostFormModal",
                    id: null,
                    post: null,
                  })
                );
              }}
            >
              <ListItemIcon>
                <AddBoxOutlinedIcon sx={{ fontSize: 30, color: "black" }} />
              </ListItemIcon>
              <ListItemText className="text" primary="Post" />
            </ListItemButton>
            <ListItemButton
              style={{ borderRadius: "12px" }}
              component="a"
              onClick={() => {
                navigate(`/profile/${user?.nickname}`);
              }}
            >
              <ListItemAvatar>
                <Avatar
                  alt="profile"
                  src={user?.profileImage?.path}
                  style={{ width: 30, height: 30 }}
                />
              </ListItemAvatar>
              <ListItemText
                style={{ fontFamily: "none" }}
                className="text"
                primary="Profile"
              />
            </ListItemButton>
          </div>
          <div className="nav-bottom">
            <ListItemButton
              style={{ borderRadius: "12px" }}
              component="a"
              onClick={handleSignOut}
            >
              <ListItemIcon>
                <LogoutIcon sx={{ fontSize: 30, color: "black" }} />
              </ListItemIcon>
              <ListItemText className="text" primary="Logout" />
            </ListItemButton>
          </div>
        </div>
      </div>
      <div ref={searchRef}>
        <Search open={searchOpen} onClose={handleCloseSearch} />
      </div>
    </div>
  );
};

export default Nav;
