if (typeof window !== undefined) {
  ('use strict');

  // reference to elements
  // const VIDEO = VIDEO_Ref?.current;
  // const CANVAS = CANVAS_Ref?.current;
  // const CONTEXT = CANVAS.getContext('2d');
  // const videoDiv = videoDiv_Ref?.current;
  // const camerasSelect = camerasSelect_Ref?.current;

  const VIDEO = document.getElementById('video');
  const CANVAS = document.getElementById('canvas');
  const CONTEXT = CANVAS.getContext('2d');
  const videoDiv = document.querySelector('.focus-area');
  const camerasSelect = document.querySelector('#camerasSelect');

  // define camera constraints
  let capturedFace = '';
  let cameraDivSize = {
    width: '',
    height: '',
  };

  let imageType = 'png';

  // updated when camera layer is visible
  let camerasArray = [];

  // retrieve any selected cameradId from local storage
  function getSelectedCamera() {
    let selectedCameraId;

    if (localStorage.getItem('userSelectedCamera')) {
      selectedCameraId = localStorage.getItem('userSelectedCamera');
    } else {
      selectedCameraId = null;
    }

    return selectedCameraId;
  }

  // set any new selected cameradId to local storage
  function setSelectedCamera(newCameraId) {
    let newSelected = newCameraId;
    if (newSelected) {
      localStorage.setItem('userSelectedCamera', newSelected);
      newSelected = localStorage.getItem('userSelectedCamera');
    }

    return newSelected;
  }

  // change stream if user selects a new camera
  async function changeStream(newCameraId) {
    // Stop the current stream
    if (VIDEO.srcObject) {
      VIDEO.srcObject.getTracks().forEach((track) => track.stop());
    }

    try {
      // Request a new stream with the selected camera
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: newCameraId },
      });

      if (newStream) {
        // Attach the new stream to the video element
        VIDEO.srcObject = newStream;
        setSelectedCamera(newCameraId);
      }
    } catch (error) {
      console.error('Error changing camera:', error);
    }
  }

  // populate camera select dropdown with available user cameras
  function listUserCameras() {
    let selectedCameraId = getSelectedCamera();

    if (camerasArray.length !== 0) {
      let newCameraSelectHtml = camerasArray.map(function (camera) {
        return `<option value="${camera.cameraId}" ${
          selectedCameraId === camera.cameraId ? 'selected' : null
        }>${camera.cameraName}</option>`;
      });

      camerasSelect.innerHTML = '';
      camerasSelect.innerHTML = newCameraSelectHtml;

      camerasSelect.addEventListener('change', onCameraSelectionChange);
    }
  }

  function onCameraSelectionChange() {
    setSelectedCamera(camerasSelect.value);
    let selectedCameraId = getSelectedCamera();
    selectedCameraId && changeStream(selectedCameraId);
  }

  // init camera on click event and set face to capture
  async function InitCamera(face = 'front') {
    capturedFace = face;
    let camerasList = await getUserCameras();

    camerasList = camerasList.filter((details) => {
      let facingMode = details.label.split('facing').join('').split(' ');
      facingMode = facingMode[facingMode.length - 1];
      return 'back' == facingMode;
    });

    // add cameras to outer-scope to be used in select element
    for (let i = 0; i < camerasList.length; i++) {
      let newCameraOption = {
        cameraId: camerasList[i].deviceId,
        cameraName: `camera ${i + 1}`,
        cameraLabel: camerasList[i].label,
      };
      camerasArray.push(newCameraOption);
      let deafultCamera = camerasArray[0]?.cameraId ?? null;
      let selectedCameraId = getSelectedCamera();
      !selectedCameraId && setSelectedCamera(deafultCamera);
      listUserCameras();
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
        deviceId: getSelectedCamera()
          ? { exact: getSelectedCamera() }
          : undefined,
      },
    });

    VIDEO.width = window.innerWidth;
    VIDEO.height = window.innerHeight;
    VIDEO.image_format = imageType;
    VIDEO.srcObject = stream;

    getContainerSize();
    await VIDEO.play();
  }

  // set camera containing element size
  function getContainerSize() {
    cameraDivSize.width = videoDiv.clientWidth;
    cameraDivSize.height = videoDiv.clientHeight;
    // alert(`video div: ${videoDiv.clientWidth} x ${videoDiv.clientHeight}`);
  }

  // draw image canvas or area
  function DrawCanvas() {
    let width = VIDEO.videoWidth;
    let height = VIDEO.videoHeight;
    CANVAS.width = width;
    CANVAS.height = height;
    let sizeWidth = CANVAS.width;
    let sizeHeight = CANVAS.height;
    const min = Math.min(width, height);
    const posX = (width - min) / 2;
    const posY = (height - min) / 2;
    CONTEXT.drawImage(VIDEO, posX, posY, min, min, 0, 0, sizeWidth, sizeHeight);
  }

  // call function in index.js to take a shot!
  function TakeShot() {
    DrawCanvas();
    // PHOTO.src = CANVAS.toDataURL();
    let srcData = CANVAS.toDataURL(`image/${imageType}`);
    // update photo or photos store
    srcData && handlePhoto(srcData, capturedFace, cameraDivSize);
    stopCamera();
  }

  function stopCamera() {
    // Release resources after shot!
    const stream = VIDEO.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track) => {
      track.stop();
    });

    // Release the media stream
    VIDEO.srcObject = null;
  }

  // function to return a list of user cameras
  async function getUserCameras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((device) => device.kind === 'videoinput');

      return cameras;
    } catch (error) {
      console.error('Error getting user cameras', error);
      return null;
    }
  }

  // function gets called on camera shot
  function handlePhoto(srcData, face, cameraDivSize) {
    // show photo in ui, process when both faces are captured
    // processImages
    // if (PHOTO_STORE.length > 0) {
    //   processImage(PHOTO_STORE[0]);
    // }

    let newImage = {
      face: face,
      imageBase64Data: srcData,
      cameraDivSize: cameraDivSize,
    };

    // do something with the image
    console.log('New Image:', newImage);

    // store Image, first clear any existing ones!
    // imagesDataArray = [];
    // imagesDataArray.push(newImage);

    // if (face === 'front') {
    //   if_user_not_offline(() => renderImage('cardFront', newImage));
    // } else {
    //   if_user_not_offline(() => renderImage('cardBack', newImage));
    // }
  }
}
