// src/pages/home/components/ContactsDebug.jsx
import useContactsPage from "../hooks/useContactsPage";

export default function ContactsDebug() {
  const {
    loading,
    error,
    videoUrl,
    googleMapsUrl,
    email,
    whatsappNumber,
  } = useContactsPage();

  if (loading) {
    return <div>Loading contacts data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ padding: "16px", fontSize: "12px" }}>
      <div>videoUrl: {videoUrl}</div>
      <div>googleMapsUrl: {googleMapsUrl}</div>
      <div>email: {email}</div>
      <div>whatsappNumber: {whatsappNumber}</div>
    </div>
  );
}