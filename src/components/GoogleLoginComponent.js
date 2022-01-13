import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
// import "../styles.css";
// import LoggedIn from "./LoggedIn";
// import { MdLogin } from "react-icons/md";

const styles =theme => ({
  loginIcon: {
    marginLeft: theme.spacing(1),
  },
});

class GoogleLoginComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { prof: {} };
  }

  componentDidMount() {
    this.googleSDK();
  }

  prepareLoginButton = () => {
    this.auth2.attachClickHandler(
      this.refs.googleLoginBtn,
      {},
      (googleUser) => {
        let profile = googleUser.getBasicProfile();
        this.setState({ prof: profile });
        console.log(this.state.prof);
      },
      (error) => {
        console.log(JSON.stringify(error, undefined, 2));
      }
    );
  };

  googleSDK = () => {
    window["googleSDKLoaded"] = () => {
      window["gapi"].load("auth2", () => {
        this.auth2 = window["gapi"].auth2.init({
          client_id: `${this.props.clientId}`,
          cookiepolicy: "single_host_origin",
          scope: "profile email",
        });
        this.prepareLoginButton();
      });
    };
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "google-jssdk");
  };

  render() {
    const { classes } = this.props;
    
    return (
      <IconButton
        color="inherit"
        className="mainGoogle__Button loginBtn loginBtn--google"
        ref="googleLoginBtn"
      >
        {this.state.prof.jf === undefined ? (
          <>
            <Typography textAlign="center">Login</Typography>
            <ExitToAppIcon className={classes.loginIcon} />
          </>
        ) : (
          <AccountCircleIcon data={this.state.prof} />
        )}
      </IconButton>
    );
  }
}
export default (withStyles(styles)(GoogleLoginComponent));
