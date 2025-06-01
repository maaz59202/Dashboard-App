// File: pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../firebaseConfig';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Dashboard = () => {
  const { userRole } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const snap = await getDocs(collection(db, 'announcements'));
      setAnnouncements(snap.docs.map(doc => doc.data()));
    };

    const fetchFiles = async () => {
      const snap = await getDocs(collection(db, 'files'));
      setUploadedFiles(snap.docs.map(doc => doc.data()));
    };

    fetchAnnouncements();
    fetchFiles();
  }, [uploadSuccess]);

  const handlePost = async () => {
    if (newAnnouncement.trim()) {
      await addDoc(collection(db, 'announcements'), {
        text: newAnnouncement,
        createdAt: serverTimestamp(),
      });
      setNewAnnouncement('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      setUploading(true);
      setUploadSuccess(false);
      const storageRef = ref(storage, `resources/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await addDoc(collection(db, 'files'), {
        name: file.name,
        url,
        createdAt: serverTimestamp(),
      });
      setUploadSuccess(true);
      setFile(null);
    } catch (err) {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
     
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Dashboard ({userRole})</h1>

          {userRole === 'instructor' && (
            <div className="mb-6">
              <textarea
                value={newAnnouncement}
                onChange={(e) => setNewAnnouncement(e.target.value)}
                placeholder="Write announcement..."
                className="w-full border border-gray-300 rounded p-2 mb-2"
              />
              <button
                onClick={handlePost}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
              >
                Post Announcement
              </button>
              <div>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="mb-2"
                />
                <button
                  onClick={handleUpload}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload File'}
                </button>
                {uploadSuccess && <p className="text-green-600 mt-2">File uploaded successfully!</p>}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Announcements:</h2>
            <ul className="list-disc pl-5">
              {announcements.map((a, idx) => (
                <li key={idx} className="mb-1">{a.text}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Resources:</h2>
            <ul className="list-disc pl-5">
              {uploadedFiles.map((file, idx) => (
                <li key={idx} className="mb-1">
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
