import React, { useState, useEffect, useRef } from "react";
import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ReactComponent as Logo } from "../../../icons/Molly.svg";
import { ReactComponent as SmallLogo } from "../../../icons/smallMolly.svg";
import HomeIcon from "@mui/icons-material/Home";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ExploreIcon from "@mui/icons-material/Explore";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import MovieCreationOutlinedIcon from "@mui/icons-material/MovieCreationOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux";
import "./index.css";
import PostForm from "../../post/postForm";
import { signOut } from "../../../Redux/auth";
import PostLoading from "../../post/postLoading";
import Search from "../search/search";
import { useLocation, useParams } from "react-router-dom";
const Nav: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.authReducer.user);
  const [postConfig, setPostConfig] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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
  const handleSignOut = () => {
    dispatch(signOut() as any);
  };
  const handleOpenModal = () => {
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
  };
  const handleOpenSearch = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setSearchOpen((prevState) => !prevState);
  };
  const onPostOpen = () => {
    setPostConfig(true);
  };
  const onPostClose = () => {
    setPostConfig(false);
  };
  return (
    <div className="nav-container">
      <div className="n">
        <div className="nav">
          <div className="nav-logo">
            {searchOpen ? <SmallLogo width={40} /> : <Logo width={110} />}
          </div>
          <div className="nav-menu">
            <ListItemButton
              className={location.pathname === "/" ? "activeTab" : ""}
              style={{ borderRadius: "12px" }}
              component="a"
              href="/"
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
              href="/explore"
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
              href="/"
            >
              <ListItemIcon>
                <MovieCreationOutlinedIcon
                  sx={{ fontSize: 30, color: "black" }}
                />
              </ListItemIcon>
              <ListItemText className="text" primary="Clip" />
            </ListItemButton>
            <ListItemButton
              style={{ borderRadius: "12px" }}
              component="a"
              href="/"
            >
              <ListItemIcon>
                <EmailOutlinedIcon sx={{ fontSize: 30, color: "black" }} />
              </ListItemIcon>
              <ListItemText className="text" primary="Messages" />
            </ListItemButton>
            <ListItemButton
              style={{ borderRadius: "12px" }}
              component="a"
              href="/"
            >
              <ListItemIcon>
                <NotificationsNoneOutlinedIcon
                  sx={{ fontSize: 30, color: "black" }}
                />
              </ListItemIcon>
              <ListItemText className="text" primary="Notifications" />
            </ListItemButton>
            <ListItemButton
              style={{ borderRadius: "12px" }}
              component="a"
              onClick={() => {
                onPostOpen();
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
              href={`/profile/${user?.nickname}`}
            >
              <ListItemAvatar>
                <Avatar
                  alt="profile"
                  src={user?.ProfileImage?.path}
                  style={{ width: 30, height: 30 }}
                />
              </ListItemAvatar>
              <ListItemText className="text" primary="profile" />
            </ListItemButton>
          </div>
          <div className="nav-bottom">
            <ListItemButton
              style={{ borderRadius: "12px" }}
              component="a"
              onClick={handleSignOut}
            >
              <ListItemIcon>
                <MenuOutlinedIcon sx={{ fontSize: 30, color: "black" }} />
              </ListItemIcon>
              <ListItemText className="text" primary="More" />
            </ListItemButton>
          </div>
          {postConfig && (
            <PostForm
              postConfig={postConfig}
              post={null}
              onClose={onPostClose}
              openModal={handleOpenModal}
            />
          )}

          <PostLoading open={open} onClose={handleCloseModal} />
        </div>
      </div>
      <div ref={searchRef}>
        <Search open={searchOpen} />
      </div>
    </div>
  );
};

export default Nav;
