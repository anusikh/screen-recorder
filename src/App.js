import "./styles.css";
import logo from "./assets/logo.png";
import React from "react";
import SoundBar from "./components/SoundBar";
import { BsSuitHeartFill, BsStop } from "react-icons/bs";
import { MdOutlinePlayArrow } from "react-icons/md";
import { AiOutlineDownload } from "react-icons/ai";
import { FiSun, FiMoon } from "react-icons/fi";
import GoogleAd from "./components/GoogleAd";
import FirebaseLogin from "./components/FirebaseLogin";
import { LogContext } from "./context/LogContext";

export default function App() {
  const [dow, setDow] = React.useState("none");
  const [stop, setStop] = React.useState(true);
  const [rec, setRec] = React.useState(false);
  const [sb, setSb] = React.useState(false);
  const [prev, setPrev] = React.useState();
  const [th, setTh] = React.useState(0);

  const { loggedIn, dispatch } = React.useContext(LogContext);

  const [videoElement, setVideoElement] = React.useState(null);
  const [downloadLink, setDownloadLink] = React.useState(null);

  const [mr, setMr] = React.useState(null);

  React.useEffect(() => {
    const videoElement1 = document.getElementsByTagName("video")[0];
    setVideoElement(videoElement1);
    const downloadLink1 = document.getElementById("download");
    setDownloadLink(downloadLink1);
  }, []);

  React.useEffect(() => {
    var r = document.querySelector(":root");

    if (th === 1) {
      r.style.setProperty("--bl", "white");
      r.style.setProperty("--wh", "black");
    } else {
      r.style.setProperty("--wh", "white");
      r.style.setProperty("--bl", "black");
    }
  });

  function startRecord() {
    setRec(true);
    setStop(false);
    setDow("none");
  }

  function stopRecord() {
    setRec(false);
    setStop(true);
    setDow("inline");
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
      mediaRecorder.state === "inactive" ? null : mediaRecorder.stop();
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

  const handleTheme = () => {
    setTh(th ^ 1);
  };

  return (
    <div className="App">
      <div className="App__IfPC">
        <div className="App__Header">
          <FirebaseLogin />
        </div>

        <div className="App__Description">
          <p>A Simple Media Recorder. Fast, Functional and Free.</p>
          {th === 0 ? (
            <FiMoon onClick={handleTheme} />
          ) : (
            <FiSun onClick={handleTheme} />
          )}
          {loggedIn === false ? (
            <span>Log In to download the Recording</span>
          ) : null}
        </div>

        <div className="App__Body">
          <div className="App__Buttons">
            <button
              style={{ display: `${dow}` }}
              className="record"
              id="Preview"
              onClick={previewRecording}
            >
              <MdOutlinePlayArrow size={22.5} />
            </button>

            <button
              style={{ display: `${loggedIn === true ? dow : "none"}` }}
              id="Download"
              className="record"
            >
              <a id="download">
                <AiOutlineDownload
                  color={th === 1 ? "white" : "black"}
                  size={24}
                />
              </a>
            </button>

            <button
              id="stop"
              className="record"
              disabled={stop}
              onClick={() => {
                setSb(false);
                mr.stop();
              }}
            >
              <BsStop size={22.5} />
            </button>
            <button
              className="record"
              disabled={rec}
              onClick={() => {
                recordAudio();
                setSb(true);
              }}
            >
              Record Audio
            </button>
            <button className="record" disabled={rec} onClick={recordVideo}>
              Record Video
            </button>
            <button className="record" disabled={rec} onClick={recordScreen}>
              Record Screen
            </button>
          </div>

          <GoogleAd />

          <div className="App__Vid">
            <video
              autoPlay
              height="300"
              width="500"
              muted
              controlsList="nodownload"
            ></video>
            {sb === true ? <SoundBar /> : null}
          </div>
        </div>
        <div className="App__Footer">
          Made with <BsSuitHeartFill />, by{" "}
          <a
            className="App__Footerlink"
            href="https://github.com/anusikh/screen-recorder"
          >
            anusikh
          </a>
        </div>
      </div>
      <div className="App__MobileMessage">
        <img
          src={logo}
          width="60"
          height="60"
          style={{ margin: "0.4rem 0 0 0.4rem" }}
        />
        <p>Sorry, only accessible via pc :(</p>
      </div>
    </div>
  );
}
