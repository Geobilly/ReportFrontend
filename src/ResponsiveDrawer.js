// ResponsiveDrawer.js

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TaskTable from "./TaskTable";
import ReportGrid from "./ReportGrid";
import ChartPie from "./ChartPie";
import { useNavigate } from "react-router-dom";
import { getStoredUsername } from "./authUtils";

const drawerWidth = 240;

const UICard = ({ title, content }) => (
  <Card
    sx={{ width: "100%", aspectRatio: 1, height: "0", paddingBottom: "100%" }}
  >
    <CardContent>
      <Typography variant="h6" component="div">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {content}
      </Typography>
    </CardContent>
  </Card>
);

function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("Dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = getStoredUsername();
    setIsLoggedIn(!!storedUsername);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSectionClick = (section) => {
    setSelectedSection(section);
    handleDrawerToggle();
  };

  const drawer = (
    <div>
      <Typography
        variant="h6"
        component="div"
        sx={{ flexGrow: 1, textAlign: "center", paddingTop: "16px" }}
      >
        RMS
      </Typography>
      <List>
        {["Dashboard", "Task", "Report"].map((text) => (
          <ListItem
            key={text}
            disablePadding
            button
            onClick={() => handleSectionClick(text)}
          >
            <ListItemButton>
              <ListItemIcon>
                <MenuIcon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  let mainContent;

  if (isLoggedIn) {
    mainContent =
      selectedSection === "Task" ? (
        <TaskTable />
      ) : selectedSection === "Report" ? (
        <ReportGrid />
      ) : (
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`,
              gap: "16px",
            }}
          >
            <UICard
              title={`Total Number of Task `}
              content="Content for Card 1"
            />
            <UICard title={`Completed Task `} content="Content for Card 2" />
            <UICard title={`Number of Reports `} content="Content for Card 3" />
            <UICard title={`Uncompleted Task `} content="Content for Card 4" />
          </Box>
          <ChartPie />
        </Box>
      );
  } else {
    navigate("/");
    mainContent = null;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {selectedSection}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      {mainContent}
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default ResponsiveDrawer;
