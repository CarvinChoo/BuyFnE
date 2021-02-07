// This is an API Layer
import client from "./client";

const endpoint = "/listings"; // data location

const getListings = () => client.get(endpoint);

// function to POST a listing
const addListing = (listing, onUploadProgress) => {
  const data = new FormData(); // Apisauce/ Axios will internally set the form data type
  data.append("title", listing.title); //sets key value pair to be added
  data.append("price", listing.price);
  data.append("categoryId", listing.category.value);
  data.append("description", listing.description);

  listing.images.forEach((image, index) =>
    data.append("images", {
      name: "image" + index,
      type: "image/jpeg",
      uri: image,
    })
  );

  if (listing.location)
    data.append("location", JSON.stringify(listing.location)); // need to serialize the value of location or server will return error

  // POST to data location
  return client.post(endpoint, data, {
    onUploadProgress: (progress) =>
      onUploadProgress(progress.loaded / progress.total),
  });
};

export default {
  addListing,
  getListings,
};
