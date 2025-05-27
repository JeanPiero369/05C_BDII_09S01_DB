import {Roboto} from "next/font/google";
import './globals.css'; 

const roboto=Roboto({
  weight: ["300","400","500","700"],
  styles: ["italic", "normal"],
  subsets: ["latin"],
});


export const metadata = {
  title: "DataQuill",
  description: "DataQuill",
};

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        {children}
      </body>
    </html>
  );
}
