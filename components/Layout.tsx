import Footer from "./Footer"
import Navbar from "./Navbar"

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Navbar />
      <div className="content">
      { children }
      </div>
      <Footer />
    </div>
  );
}
 
export default Layout;