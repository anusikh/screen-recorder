import React from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import StopIcon from "@material-ui/icons/Stop";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import GetAppIcon from "@material-ui/icons/GetApp";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import SplitText from "../components/SplitText";
import { pxToVh, pxToVw } from "../utils/PxtoRemUtil";
import SoundBar from "../components/SoundBar";

const useStyles = makeStyles((theme) => ({
  textGrid: {
    color: "white",
    textAlign: "center",
    lineHeight: "2rem",
  },
  text: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(4),
  },
  paper: {
    marginLeft: theme.spacing(4),
    marginTop: theme.spacing(4),
    backgroundColor: "transparent",
    boxShadow: 'none'
  },
  recordBtn: {
    color: "#dfdce8",
    backgroundColor: "#5139B5",
    margin: theme.spacing(1),
    marginBottom: theme.spacing(2),
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#8d7ade",
    },
  },
  stopBtn: {
    color: "#dfdce8",
    backgroundColor: "#e3122b",
    margin: theme.spacing(1),
    marginBottom: theme.spacing(2),
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#e87684",
    },
  },
  downloadBtn: {
    color: "#dfdce8",
    backgroundColor: "#4c65e6",
    margin: theme.spacing(1),
    marginBottom: theme.spacing(2),
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#8394eb",
    },
    textDecoration:'none'
  },
  previewBtn: {
    color: "#dfdce8",
    backgroundColor: "#56967c",
    margin: theme.spacing(1),
    marginBottom: theme.spacing(2),
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#c5e8da",
    },
  },
  recordScreen: {
    height: pxToVh(320),
    width: pxToVw(950),
  },
}));

export default function ScorderRecordComponent() {
  const classes = useStyles();

  const [dow, setDow] = React.useState("none");
  const [stop, setStop] = React.useState(true);
  const [rec, setRec] = React.useState(false);
  const [sb, setSb] = React.useState(false);
  const [prev, setPrev] = React.useState();

  const [videoElement, setVideoElement] = React.useState(null);
  const [downloadLink, setDownloadLink] = React.useState(null);

  const [mr, setMr] = React.useState(null);

  React.useEffect(() => {
    const videoElement1 = document.getElementsByTagName("video")[0];
    setVideoElement(videoElement1);
    const downloadLink1 = document.getElementById("download");
    setDownloadLink(downloadLink1);
  }, []);

  function startRecord() {
    setRec(true);
    setStop(false);
    setDow("none");
  }

  function stopRecord() {
    setRec(false);
    setStop(true);
    setDow("inline");
    console.log(downloadLink);
  }

  const audioRecordConstraints = {
    echoCancellation: true,
  };

  const handleRecord = function ({ stream, mimeType }) {
    startRecord();
    let recordedChunks = [];
    const mediaRecorder = new MediaRecorder(stream);
    setMr(mediaRecorder);

    mediaRecorder.ondataavailable = function (e) {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = function () {
      const blob = new Blob(recordedChunks, {
        type: mimeType,
      });
      recordedChunks = [];
      const filename = window.prompt("Enter file name");
      downloadLink.href = URL.createObjectURL(blob);
      setPrev(URL.createObjectURL(blob));
      downloadLink.download = `${filename || "recording"}.webm`;
      stopRecord();
      var tracks = mediaRecorder.stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      videoElement.srcObject = null;
    };

    mediaRecorder.start(200);
  };

  async function recordAudio() {
    const mimeType = "audio/webm";
    navigator.mediaDevices
      .getUserMedia({
        audio: audioRecordConstraints,
      })
      .then(function (stream) {
        handleRecord({ stream, mimeType });
      });
  }

  async function recordVideo() {
    const mimeType = "video/webm";
    const constraints = {
      audio: {
        echoCancellation: true,
      },
      video: {
        width: {
          min: 640,
          max: 1024,
        },
        height: {
          min: 480,
          max: 768,
        },
      },
    };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      videoElement.srcObject = stream;
      handleRecord({ stream, mimeType });
    });
  }

  const previewRecording = () => {
    videoElement.src = prev;
    videoElement.controls = true;
    videoElement.load();
  };

  async function recordScreen() {
    const mimeType = "video/webm";
    const constraints = {
      video: {
        cursor: "motion",
      },
    };
    if (!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia)) {
      return window.alert("Screen Record not supported!");
    }

    let stream = null;

    const displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: { cursor: "motion" },
      audio: { echoCancellation: true },
    });

    const voiceStream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true },
      video: false,
    });

    const audioTrackAvailable =
      displayStream.getAudioTracks().length === 0 ? false : true;

    const audioContext = new AudioContext();
    const audioIn01 = !audioTrackAvailable
      ? null
      : audioContext.createMediaStreamSource(displayStream);
    const audioIn02 = audioContext.createMediaStreamSource(voiceStream);
    const audioDestination = audioContext.createMediaStreamDestination();

    !audioTrackAvailable ? null : audioIn01.connect(audioDestination);
    audioIn02.connect(audioDestination);

    const tracks = [
      ...displayStream.getVideoTracks(),
      ...audioDestination?.stream?.getTracks(),
    ];

    stream = new MediaStream(tracks);

    handleRecord({ stream, mimeType });
    videoElement.srcObject = stream;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        <Grid item xs={12} sm={12} md={8} lg={8}>
          <Paper className={classes.paper}>
            <div style={{ display: "flex" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Button
                  className={classes.recordBtn}
                  disabled={rec}
                  onClick={() => {
                    recordAudio();
                    setSb(true);
                  }}
                >
                  <Typography>Record Audio</Typography>
                </Button>
                <Button
                  className={classes.recordBtn}
                  onClick={recordVideo}
                  disabled={rec}
                >
                  <Typography>Record Video</Typography>
                </Button>
                <Button
                  className={classes.recordBtn}
                  onClick={recordScreen}
                  disabled={rec}
                >
                  <Typography>Record Screen</Typography>
                </Button>
                <Button
                  id="stop"
                  className={classes.stopBtn}
                  disabled={stop}
                  onClick={() => {
                    setSb(false);
                    mr.stop();
                  }}
                >
                  <StopIcon />
                </Button>
                <Button
                  style={{ display: `${dow}` }}
                  className={classes.previewBtn}
                  onClick={previewRecording}
                >
                  <PlayCircleFilledIcon />
                </Button>
                <Button
                  className={classes.downloadBtn}
                  style={{ display: `${dow}` }}
                >
                  <a id="download">
                    <GetAppIcon />
                  </a>
                </Button>
              </div>
              <div>
                <video className={classes.recordScreen} autoPlay muted></video>
                {sb === true ? <SoundBar /> : null}
              </div>
            </div>
          </Paper>
        </Grid>
        <Grid className={classes.textGrid} item xs={12} sm={12} md={4} lg={4}>
          <h2 className={classes.text}>
            <SplitText copy="Scorder" role="body" />
          </h2>
          <h4 className={classes.text}>
            <SplitText
              copy="Your simple Media Recorder. Fast, Functional and Free. Record media on the go, without the hassle of complicated Software."
              role="body"
            />
          </h4>
        </Grid>
      </Grid>
    </Box>
  );
}
