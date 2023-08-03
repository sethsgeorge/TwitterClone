import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { changeProfile, logout } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../firebase";

const EditProfile = ({ setOpen }) => {
  const { currentUser } = useSelector((state) => state.user);

  const [img, setImg] = useState(null);
  const [imgUploadProgress, setImgUploadProgress] = useState(0);
  const [bio, setBio] = useState("");
  const [bioUpdated, setBioUpdated] = useState(false);
  const [currentProfilePicturePreview, setCurrentProfilePicturePreview] = useState(null); // New state for the current profile picture preview
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const uploadImg = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgUploadProgress(Math.round(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          try {
            const updateProfile = await axios.put(`/users/${currentUser._id}`, {
              profilePicture: downloadURL,
            });
            console.log(updateProfile);
          } catch (error) {
            console.log(error);
          }
          console.log("downloaded " + downloadURL);
          dispatch(changeProfile(downloadURL));
        });
      }
    );
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
    setBioUpdated(false);
  };

  const handleSubmit = async () => {
    try {
      const updateBio = await axios.put(`/users/${currentUser._id}`, {
        description: bio,
      });
      setBioUpdated(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      if (!currentUser) {
        navigate("/signin");
        return;
      }
      const deleteProfile = await axios.delete(`/users/${currentUser._id}`);
      dispatch(logout());
      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setCurrentProfilePicturePreview(currentUser.profilePicture);
  }, [currentUser]);

  useEffect(() => {
    img && uploadImg(img);
  }, [img]);

  return (
    <div className="absolute w-full h-full top-0 left-0 bg-transparent flex items-center justify-center">
      <div className="w-[600px] h-[600px] bg-slate-200 rounded-lg p-8 flex flex-col gap-4 relative">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 cursor-pointer"
        >
          X
        </button>
        <h2 className="font-bold text-xl">Edit Profile</h2>

        {/* Show the current profile picture */}
        {currentProfilePicturePreview && (
          <img
            src={currentProfilePicturePreview}
            alt="Current Profile"
            className="w-20 h-20 rounded-full"
          />
        )}

        <p>Choose a new profile picture</p>
        {imgUploadProgress > 0 ? (
          `Uploading ${imgUploadProgress}%`
        ) : (
          <>
            <input
              type="file"
              className="bg-transparent border border-slate-500 rounded p-2"
              accept="image/*"
              onChange={(e) => setImg(e.target.files[0])}
            />
            {img && (
              <img
                src={URL.createObjectURL(img)}
                alt="Selected for upload"
                className="w-20 h-20 rounded-full"
              />
            )}
          </>
        )}

        <p>Enter your bio:</p>
        <textarea
          className="bg-transparent border border-slate-500 rounded p-2"
          rows={3}
          value={bio}
          onChange={handleBioChange}
        />

        <button
          className="bg-blue-500 text-white py-2 rounded-full"
          onClick={handleSubmit}
        >
          Save Bio
        </button>

        {bioUpdated && <p>Bio updated successfully</p>} {/* Render the success message when bio is updated */}

        <button
          className="bg-red-500 text-white py-2 rounded-full"
          onClick={handleDelete}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default EditProfile;