import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { preview, download } from "../assets";
import { getRandomPrompt } from "../utils";
import { FormField, Loader } from "../components";

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [communityLoading, setCommunityLoading] = useState(false);
  const [collectionLoading, setCollectionLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch("http://localhost:8080/api/v1/dalle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: form.prompt,
          }),
        });

        const data = await response.json();
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
      } catch (err) {
        alert(err);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert("Please provide a proper prompt");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (form.prompt && form.photo) {
      setCommunityLoading(true);
  
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('token') 
      
      
        if (!token) {
          alert('User not authenticated. Please log in.');
          navigate('/login'); // Redirect to the login page if the user is not authenticated
          return;
        }
  
        // Include the Authorization header with the token in the fetch request
        const response = await fetch(`http://localhost:8080/api/v1/post/create-public/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization":token,
          },
          body: JSON.stringify({ ...form }),
        });
  
        await response.json();
        console.log(response.data)
        alert("Success");
        navigate("/home");
      } catch (err) {
        alert(err);
      } finally {
        setCommunityLoading(false);
      }
    } else {
      alert("Please generate an image with proper details");
    }
  };

  const handlePrivateSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setCollectionLoading(true);

      try {
        const token = localStorage.getItem('token') 
        // const userId = localStorage.getItem('userId') 
        if (!token) {
          alert('User not authenticated. Please log in.');
          navigate('/login'); // Redirect to the login page if the user is not authenticated
          return;
        }
        const response = await fetch("http://localhost:8080/api/v1/post/create-private", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization":token
          },
          body: JSON.stringify({ ...form}),
        });

        await response.json();
        alert("Success");
        navigate("/mycollection");
      } catch (err) {
        alert(err);
      } finally {
        setCollectionLoading(false);
      }
    } else {
      alert("Please generate an image with proper details");
    }
  };

  const handleDownload = () => {
    if (form.photo) {
      const link = document.createElement("a");
      link.href = form.photo;
      link.download = "generated_image.jpg";
      link.click();
    } else {
      alert("No image available to download");
    }
  };

  return (
    <section className="max-w-7xl mx-auto p-6">
      <div>
        <h1 className="font-extrabold text-[#2e2e2e] text-[22px]">Create</h1>
        <p className="mt-2 text-[#2e2e2e] text-[18px] max-w-[400px]">
          Generate an imaginative image through Image Genie and share it with the community
        </p>
      </div>

      <form className="mt-10 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder=""
            value={form.name}
            handleChange={handleChange}
          />

          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="Describe the image you want to get"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />

          <div className="relative bg-gray-50 border border-gray-300 text-gray-900  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-80 p-0 h-80 flex justify-center items-center">
            {form.photo ? (
              <>
                <img
                  src={form.photo}
                  alt={form.prompt}
                  className="w-full h-full object-contain"
                />
              </>
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[#2e2e2e] rounded-lg text-[rgb(244,242,242)]">
                <Loader />
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className="text-white bg-[#2c40b2] hover:bg-[#2e2e2e] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? "Generating" : "Generate"}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="outline-none px-2 py-2  bg-[#1ad13f]  hover:bg-[#2e2e2e]  text-white font-bold rounded"
          >
            <img src={download} alt="download" className="w-6 h-6 object-contain invert"/>
          </button>
        </div>
        <div className="mt-10">
          <p className="mt-2 text-[#2e2e2e] text-[16px]">
            Once you have created the image you want, you can share it with the community as well as to Your Collection
          </p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#2c40b2] hover:bg-[#2e2e2e] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            disabled={communityLoading}
          >
            {communityLoading ? "Sharing..." : "Share to Community"}
          </button>
          <button
            type="submit"
            onClick={handlePrivateSubmit}
            className="mt-3 ml-4 text-white bg-[#2c40b2] hover:bg-[#2e2e2e] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            disabled={collectionLoading}
          >
            {collectionLoading ? "Sharing..." : "Share to Collection"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;

