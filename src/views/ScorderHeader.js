import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import GoogleLoginComponent from "../components/GoogleLoginComponent";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: "transparent",
    boxShadow: "none",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: "flex",
  },
  loginIcon: {
    marginLeft: theme.spacing(1),
  },
}));

const pages = ["Record", "About", "Support Us"];

export default function ScorderHeader() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="static">
        <Toolbar>
          <Box className={classes.title}>
            {pages.map((page) => (
              <MenuItem key={page}>
                <Typography textAlign="center">{page}</Typography>
              </MenuItem>
            ))}
          </Box>
          <Box>
            <GoogleLoginComponent clientId={process.env.REACT_APP_CLIENT_ID}/>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
}
