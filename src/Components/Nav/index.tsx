import React, { useState, useEffect } from "react";
import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import MovieCreationOutlinedIcon from "@mui/icons-material/MovieCreationOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux";
import "./index.css";
import PostForm from "../post/postForm";
const Nav: React.FC = () => {
  const user = useSelector((state: RootState) => state.authReducer.user);
  const [postConfig, setPostConfig] = useState(false);
  return (
    <div className="nav">
      <div className="nav-logo">
        <img
          className="logo"
          src="/images/molly_logo.png"
          width="100px"
          alt="molly Logo"
        />
      </div>
      <div className="nav-menu">
        <ListItemButton component="a" href="/profile">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton component="a" href="/">
          <ListItemIcon>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText primary="Search" />
        </ListItemButton>
        <ListItemButton component="a" href="/">
          <ListItemIcon>
            <ExploreOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Explore" />
        </ListItemButton>
        <ListItemButton component="a" href="/">
          <ListItemIcon>
            <MovieCreationOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Clip" />
        </ListItemButton>
        <ListItemButton component="a" href="/">
          <ListItemIcon>
            <EmailOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Messages" />
        </ListItemButton>
        <ListItemButton component="a" href="/">
          <ListItemIcon>
            <NotificationsNoneOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Notifications" />
        </ListItemButton>
        <ListItemButton
          component="a"
          onClick={() => {
            setPostConfig(true);
          }}
        >
          <ListItemIcon>
            <AddBoxOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Post" />
        </ListItemButton>
        <ListItemButton component="a" href="/">
          <ListItemAvatar>
            <Avatar
              alt="profile"
              src={user?.ProfileImage?.path}
              style={{ width: 25, height: 25 }}
            />
          </ListItemAvatar>
          <ListItemText primary="profile" />
        </ListItemButton>
      </div>
      <div className="nav-bottom">
        <ListItemButton component="a" href="/">
          <ListItemIcon>
            <MenuOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="More" />
        </ListItemButton>
      </div>
      <PostForm postConfig={postConfig} setPostConfig={setPostConfig} />
    </div>
  );
};

export default Nav;
