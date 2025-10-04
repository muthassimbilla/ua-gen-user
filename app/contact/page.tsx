import { ContactPage } from "@/components/contact-page";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation activeSection="contact" />
      <ContactPage />
      <Footer />
      </div>
  );
}
