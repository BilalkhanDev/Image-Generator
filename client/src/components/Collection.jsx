import * as React from 'react';
import { useEffect, useState } from 'react';
import { download } from '../assets';
import { useNavigate } from 'react-router-dom';

const Collection = () => {
  const [post, setPost] = useState([]);
  const navigate=useNavigate()
  const [isLoading, setLoading] = useState(false);

  const fetchPrivatePosts = async () => {
    try {
      const userId = localStorage.getItem('userId') 
      const token = localStorage.getItem('token') 
      
      if (!userId) {
        alert('User not authenticated. Please log in.');
        navigate('/login'); // Redirect to the login page if the user is not authenticated
        return;
      }
      const response = await fetch(`http://localhost:8080/api/v1/post/get-posts/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization":token
        },
      });

      if (response.ok) {
        const postData = await response.json();
        setPost(postData.data);
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (err) {
      console.error('Request failed:', err);
      alert('An error occurred while processing your request');
    }
  }; 

  const handleDownload = async (id, photoUrl) => {
    setLoading(true);
    try {
      const response = await fetch(photoUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `image_${id}.jpg`;
      link.click();
      setLoading(false);
    } catch (err) {
      console.error('Download failed:', err);
      alert('An error occurred while downloading the image');
      setLoading(false);
    }
  };

  const SharetoComunity = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') 
      const userId = localStorage.getItem('userId') 
      if (!token) {
        alert('User not authenticated. Please log in.');
        navigate('/login'); // Redirect to the login page if the user is not authenticated
        return;
      }
      const response = await fetch(`http://localhost:8080/api/v1/post/private-to/${userId}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization":token
        },
      });

      if (response.ok) {
        await response.json();
        alert("Sharing Successful");
        navigate('/home');
     
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (err) {
      console.json( err.message);
      alert('An error occurred while processing your request');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchPrivatePosts();
  
  }, []);
if (!post){
  return false
}
  return (
    <div className="my-8">
      {post.length === 0 ? (
        <p className="text-center font-bold text-[28px] text-[#f16043] mt-40 ">No post yet </p>
      ) : (
        <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
          {post.map((item) => (
            <div key={item._id} className="rounded-xl group relative shadow-card hover:shadow-cardhover card">
              <div className="group">
                <img
                  className="w-full h-auto object-cover medium-image rounded-md"
                  src={item.photo}
                  alt={item.prompt}
                  style={{ marginLeft: '5px', marginRight: '5px' }}
                />
                <div className="group-hover:flex flex-col max-h-[94.5%] hidden absolute bottom-0 left-0 right-0 bg-[#2e2e2e] m-2 p-4 rounded-md">
                  <p className="text-white text-[10px] overflow-y-auto prompt">{item.prompt}</p>
                  <div className="mt-5 flex justify-between items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full object-cover bg-green-700 flex justify-center items-center text-white text-xs font-bold">{item.name[0]}</div>
                      <p className="text-white text-[12px]">{item.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDownload(item._id, item.photo)}
                        className="outline-none bg-transparent border-none pl-5"
                        disabled={isLoading}
                      >
                        <img src={download} alt="download" className="w-6 h-6 object-contain invert" />
                      </button>
                      <button
                        type="button"
                        onClick={() => SharetoComunity(item._id)}
                        className="text-white bg-[#2c40b2] hover:bg-[#2e2e2e] rounded-md text-[11px] w-full sm:w-auto px-3 py-2.5 text-center"
                        disabled={isLoading}
                      >
                        {isLoading ? "Sharing..." : "Share to Community"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Collection;
