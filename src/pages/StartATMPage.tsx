import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { EnquiryFormProgressive } from "@/components/EnquiryFormProgressive";
import { useTranslation } from 'react-i18next';

const StartATMPage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <EnquiryFormProgressive />
      </main>
      <Footer />
    </div>
  );
};

export default StartATMPage;