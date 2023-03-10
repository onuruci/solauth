import uploadImageIcon from "../images/photo.png";
import { IconButton } from "@mui/material";

export const ProfilePictureDropZone = ({ dispatch, preview }) => {
  return (
    <div className="flex flex-row gap-8 items-center">
      <IconButton color="primary" aria-label="upload picture" component="label">
        <input
          onChange={(e) =>
            dispatch({
              type: "changed_image",
              nextImage: e.target.files[0],
            })
          }
          hidden
          accept="image/*"
          type="file"
        />

        <img
          className="w-16 h-16"
          src={uploadImageIcon}
          alt="upload-profile-image"
        />
      </IconButton>
      {preview && (
        <img className="w-14 h-14 rounded-lg" src={preview} alt="errror" />
      )}
    </div>
  );
};
