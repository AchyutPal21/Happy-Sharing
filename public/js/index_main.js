const sharingWrapper = document.querySelector(".sharing_wrapper");
const fileInput = document.querySelector("#fileInput");
const browseFile = document.querySelector(".browse_file");
const progressBar = document.querySelector(".progress_bar");
const overlay = document.querySelector(".overlay");
const overlayShowLink = document.querySelector(".file_sharing_link");
const copyDownloadPgLink = overlay.querySelector(".copy_link");

const overlayBtn = overlay.querySelector(".fa-window-close");

// Form Send
const mailFrom = overlay.querySelector("#sender");
const mailTo = overlay.querySelector("#receiver");
const sendMailBtn = overlay.querySelector("#emailForm");
// Tost message
const tost = document.querySelector(".tost_container");

const host = "https://happy-sharing-efs.herokuapp.com";
const uploadURL = `${host}/api/v1/file`;
const emailURL = `${host}/file/download/email`;

// ---------------------------Code---------------------------

let fullWidth = 0;
let width = 0;
let callInit = 0;

function init() {
  fullWidth = parseInt(getComputedStyle(progressBar).width) > 524 ? 524 : 310;
  // console.log(fullWidth);
  progressBar.style.width = "0px";
  // console.log(fullWidth);
}
// init();

// CLOSE THE TIMERS
const clearTimer = (timer) => clearTimeout(timer);

// COPY DOWNLOAD PAGE LINK
function copyDownloadLink() {
  const link = overlayShowLink.textContent.trim();
  // console.log(link);
  navigator.clipboard.writeText(link);
  overlayShowLink.style.color = "#1bb5f2";
  copyDownloadPgLink.innerHTML = `<i class="far fa-check-circle"></i>`;
}

// TOST MESSAGE
let toster;
function tostMsg(msg, msgType) {
  try {
    tost.textContent = "";
    tost.textContent = msg;
    tost.classList.add(msgType ? "tost_success" : "tost_error");
    tost.classList.add("tost_in");

    toster = setTimeout(() => {
      tost.classList.contains("tost_in") && tost.classList.remove("tost_in");
      tost.classList.contains("tost_success") &&
        tost.classList.remove("tost_success");
      tost.classList.contains("tost_error") &&
        tost.classList.remove("tost_error");

      clearTimer(toster);
    }, 4000);
  } catch (err) {
    console.error("🔥", err);
  }
}

// UPDATING THE PROGRRESS BAR
let removePgBar;
function updateProgress(e) {
  if (progressBar.style.opacity === "0") {
    progressBar.style.opacity = "1";
  }
  let percent = Math.round((e.loaded / e.total) * 100);

  width = Math.round((percent * fullWidth) / 100);
  progressBar.style.width = `${width}px`;

  if (width === fullWidth) {
    removePgBar = setTimeout(() => {
      progressBar.style.opacity = "0";
      progressBar.style.width = "0px";
      // showOverlay();
      clearTimer(removePgBar);
    }, 1500);
  }
}

// SHOW THE DOWNLOAD PAGE LINK
let delayOverlay;
function showDownloadPageLink(link) {
  const { file } = JSON.parse(link);
  delayOverlay = setTimeout(() => {
    overlayShowLink.textContent = file;
    overlay.style.opacity = "1";
    mailFrom.value = mailTo.value = "";

    // if (fullWidth >= 524) {
    //   overlay.style.transform = "translate(-350px, -35vh)";
    // } else {
    //   overlay.style.transform = "translate(-180px, -35vh)";
    // }

    overlay.style.transform =
      fullWidth >= 524
        ? "translate(-350px, -35vh)"
        : "translate(-180px, -35vh)";

    // console.log(fullWidth, overlay.style.transform);

    // overlay.style.transform = "translate(-350px, -35vh)";
    clearTimer(delayOverlay);
  }, 1500);
}

// COLLECTIN THE USER UPLOADED FILE
function uploadFile() {
  try {
    const file = fileInput.files[0];

    if (file.size >= 104857600) {
      return tostMsg("File less then 100MB only", false);
    }

    // making the fileInput empty for next upload.
    fileInput.value = "";

    const formData = new FormData();
    formData.append("myfile", file);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        // console.log("SUCCESSFULL...");
        // console.log(xhr.response);
        showDownloadPageLink(xhr.response);
      }
    };

    xhr.upload.onprogress = updateProgress;

    xhr.upload.onerror = () => {
      fileInput.value = "";
      console.error("🔥", xhr);
      tostMsg(xhr.statusText || "Cannot upload given file.", false);
    };

    xhr.open("POST", uploadURL);
    xhr.send(formData);

    // return tostMsg("File uploaded successfully", true);
  } catch (err) {
    console.error("🔥", err);
  }
}

// DRAGOVER LISTENER
sharingWrapper.addEventListener("dragover", function (e) {
  e.preventDefault();
  if (!this.classList.contains("sharing_wrapper_border")) {
    this.classList.add("sharing_wrapper_border");
  }
});

// DRAGLEAVE LISTENER
sharingWrapper.addEventListener("dragleave", function (e) {
  e.preventDefault();
  this.classList.remove("sharing_wrapper_border");
});

// DROP FILE UPLOAD
sharingWrapper.addEventListener("drop", function (e) {
  try {
    e.preventDefault();
    this.classList.remove("sharing_wrapper_border");

    const file = e.dataTransfer.files;

    // console.log("DROP CONTAINER", file);

    // WHEN NO FILE DROPED IS HAPPENED
    if (!file.length) {
      return tostMsg("File not added. Try again.", false);
    }

    // WHEN DROPED FILES ARE MORE THEN ONE
    if (file.length > 1) {
      return tostMsg("One file at a time.", false);
    }

    fileInput.files = file;
    uploadFile();
  } catch (err) {
    console.error("🔥", err);
  }
});

// INPUT FILE UPLOADED
fileInput.addEventListener("change", function (e) {
  uploadFile();
});

// BROWSE FILE BUTTON
browseFile.addEventListener("click", function (e) {
  e.preventDefault();
  fileInput.click();
});

// COPY LINK
overlayShowLink.addEventListener("click", function (e) {
  copyDownloadLink();
  tostMsg("link copied to clipboard.", true);
});

// COPY LINK FROM BTN
let closeOverlayMailSend;
copyDownloadPgLink.addEventListener("click", function (e) {
  copyDownloadLink();
  tostMsg("link copied to clipboard.", true);
});

sendMailBtn.addEventListener("submit", function (e) {
  e.preventDefault();
  const uuid = overlayShowLink.textContent.split("/").splice(-1, 1)[0];
  const to = mailTo.value.trim();
  const from = mailFrom.value.trim();

  const formDate = {
    uuid,
    emailTo: to,
    emailFrom: from,
  };

  fetch(emailURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formDate),
  })
    .then((data) => data.json())
    .then((data) => {
      const { success, error = false } = data;
      if (error) {
        tostMsg(error, false);
      } else {
        closeOverlayMailSend = setTimeout(() => {
          overlay.style.opacity = "1";
          tostMsg(success, true);
          clearTimer(closeOverlayMailSend);
        }, 1000);
        overlay.style.transform = "translate(-350px, -700vh)";
      }
    })
    .catch((err) => {
      console.error("🔥", err);
    });
});

// Overlay Btn
let hideOverlay;
overlay.addEventListener("click", function (e) {
  if (e.target.closest(".closing_btn")) {
    hideOverlay = setTimeout(() => {
      overlay.style.opacity = "1";
      clearTimer(hideOverlay);
    }, 1000);
    overlay.style.transform = "translate(-350px, -700vh)";
  }
});

// initialiazing the init function once aftet gettig the correct width
if (!callInit) {
  ++callInit;
  init();
}
