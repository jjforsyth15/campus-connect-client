import "./globals.css";

export const metadata = {
  title: "Campus Connect",
  description: "Login to Campus Connect",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="background-video"
        >
          <source src="https://live-csu-northridge.pantheonsite.io/sites/default/files/2025-09/Generic%20Webpage%20Final%20New%20Bitrate.mp4" type="video/mp4" />
        </video>

        {/* Overlay for login page */}
        <div className="overlay">
          {children}
        </div>
      </body>
    </html>
  );
}
