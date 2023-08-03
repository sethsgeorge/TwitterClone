import React, { useState, useEffect} from "react";
import TimelineTweet from "../TimelineTweet/TimelineTweet";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import  getCroppedImg from "../EditProfile/getCroppedImg";

import Cropper from "react-easy-crop";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";

const MainTweet = () => {
  const [tweetText, setTweetText] = useState("");
  const [tweetFile, setTweetFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);
  const [imgUploadProgress, setImgUploadProgress] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setTweetFile(file);
  };
    useEffect(() => {
    if (tweetFile) {
      const image = new Image();
      image.src = URL.createObjectURL(tweetFile);

      image.onload = () => {
        const imageAspectRatio = image.width / image.height;
        setAspectRatio(imageAspectRatio);
      };
    }
  }, [tweetFile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("handleSubmit: Start");
  
      if (tweetFile && croppedImage) {
        console.log("handleSubmit: Image cropped");
        // If the image is selected and cropped, upload the cropped image and then tweet
        setImgUploadProgress(0);
        const croppedBlob = await getCroppedImg(URL.createObjectURL(tweetFile), croppedImage);
        console.log("handleSubmit: Cropped image blob obtained");
        const fileUrl = await uploadFile(croppedBlob);
        console.log("handleSubmit: Image uploaded to Firebase Storage. File URL:", fileUrl);
        // Use the fileUrl to post the tweet along with the image URL
        const submitTweet = await axios.post("/tweets", {
          userId: currentUser._id,
          description: tweetText,
          file: fileUrl,
        });
        console.log("handleSubmit: Tweet submitted with an image");
        window.location.reload(false);
      } else if (tweetFile && !croppedImage) {
        console.log("handleSubmit: Image not cropped");
        // If the image is selected but not cropped, proceed to tweet without an image
        const submitTweet = await axios.post("/tweets", {
          userId: currentUser._id,
          description: tweetText || "", // Pass an empty string if no text is provided
        });
        console.log("handleSubmit: Tweet submitted without an image");
        window.location.reload(false);
      } else {
        console.log("handleSubmit: No image selected");
        // If there is no image selected, proceed to tweet without an image
        const submitTweet = await axios.post("/tweets", {
          userId: currentUser._id,
          description: tweetText || "", // Pass an empty string if no text is provided
        });
        console.log("handleSubmit: Tweet submitted without an image");
        window.location.reload(false);
      }
    } catch (err) {
      console.log("handleSubmit Error:", err);
    }
  };
  

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedImage(croppedAreaPixels);
  };

  const uploadFile = async (file) => {
    if (!file) return null;
  
    const storage = getStorage(app);
    const fileName = Date.now() + "_" + file.name; // Add a timestamp to the file name
    const storageRef = ref(storage, "images/" + fileName);
  
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImgUploadProgress(progress);
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  };

  return (
    <div>
      {currentUser && (
        <p className="font-bold pl-2 my-2">{currentUser.username}</p>
      )}

      <form className="border-b-2 pb-6">
        <textarea
          onChange={(e) => setTweetText(e.target.value)}
          type="text"
          placeholder="What's happening"
          maxLength={280}
          className="bg-slate-200 rounded-lg w-full p-2"
        ></textarea>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={imgUploadProgress > 0}
        >
          Tweet
        </Button>
        {tweetFile && (
          <div className="flex flex-col items-center mt-4">
            <div className="w-200 h-200 relative">
              <img
              
                src={URL.createObjectURL(tweetFile)}
                alt="Selected for cropping"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
              <Cropper
                image={URL.createObjectURL(tweetFile)}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              
                showGrid={false}
              />
            </div>
            <Slider
              value={zoom}
              min={0.5}
              max={3}
              step={0.05}
              onChange={(e, zoom) => setZoom(zoom)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={imgUploadProgress > 0}
            >
              Tweet
            </Button>
          </div>
        )}
      </form>
      <TimelineTweet />
    </div>
  );
};

export default MainTweet;