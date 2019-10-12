const video = document.getElementById('video') //getting the video element from the html file to work on it


Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('../models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('../models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('../models'),
  faceapi.nets.faceExpressionNet.loadFromUri('../models')
]).then(startVideo())        //calling the models we need to do the face detection from faceapi


function startVideo() {             // displaying the video from the user's webcam
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {   //Event listener that activate when video is streamed from the user's webcam
  const canvas = faceapi.createCanvasFromMedia(video)  //Creating a canvas from the video element to drow on the user's face
  document.body.append(canvas) // adding the canvas at the end of the body element on the html file
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizeDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizeDetections) //draws a square around the user's face
    faceapi.draw.drawFaceLandmarks(canvas, resizeDetections) //draws marks on user's eyes, nose mouth and eyebrows
    faceapi.draw.drawFaceExpressions(canvas, resizeDetections) //recognizes the user's emotions

  }, 100)
})
