import "./globals.css";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from '@react-oauth/google';

export const metadata = {
  title: "DriveFleet — Premium Car Rental",
  description: "Rent premium cars at the best prices",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <Toaster position="top-center" />
  
        <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}