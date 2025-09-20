import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocale } from "@/context/locale-context";
import { Award, Bot, Cpu, Github, Linkedin, Mail, Phone, Telescope } from "lucide-react";
import LeafLogo from "../icons/leaf-logo";

type AboutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const { t } = useLocale();

  const features = [
    { icon: Cpu, text: t('featureDiagnosis') },
    { icon: Telescope, text: t('featureForecast') },
    { icon: Bot, text: t('featureChatbot') },
    { icon: Award, text: t('featureInsurance') },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline text-primary text-2xl flex items-center gap-2">
            <LeafLogo className="h-6 w-6"/> {t('aboutTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('aboutDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">{t('projectHighlights')}</h3>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-background rounded-lg border">
                  <feature.icon className="h-6 w-6 text-accent shrink-0" />
                  <p className="text-sm text-foreground">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
             <h3 className="font-bold text-lg mb-2">{t('developedBy')}</h3>
             <div className="p-4 border rounded-lg bg-background flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="space-y-1 flex-grow">
                    <h4 className="font-bold text-lg">Arjun Reddy</h4>
                    <p className="text-sm text-muted-foreground">Full Stack Developer - Broadridge Fintech</p>
                    <p className="text-sm text-muted-foreground">Karnataka</p>
                </div>
                <div className="flex items-center gap-2">
                    <a href="mailto:arjunredyr2001@gmail.com">
                        <Button variant="outline" size="icon" asChild>
                           <div>
                             <Mail className="h-4 w-4" />
                           </div>
                        </Button>
                    </a>
                     <a href="tel:9380724044">
                        <Button variant="outline" size="icon" asChild>
                           <div>
                            <Phone className="h-4 w-4" />
                           </div>
                        </Button>
                    </a>
                </div>
             </div>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
