import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocale } from "@/context/locale-context";
import { MapPin, Phone, Syringe } from "lucide-react";

type Dealer = {
  name: string;
  address: string;
  phone: string;
};

type AgroDealerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  dealers: Dealer[];
  remedy: string;
};

export default function AgroDealerModal({ isOpen, onClose, dealers, remedy }: AgroDealerModalProps) {
  const { t } = useLocale();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-primary">{t('nearbyAgroDealers')}</DialogTitle>
          <DialogDescription>
            {t('agroDealerDescription', { remedy: remedy })}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[400px] overflow-y-auto">
          {dealers.length > 0 ? (
            dealers.map((dealer, index) => (
              <div key={index} className="p-4 border rounded-lg bg-background">
                <h3 className="font-bold text-lg">{dealer.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center mt-1">
                  <MapPin className="mr-2 h-4 w-4 shrink-0" />
                  {dealer.address}
                </p>
                <p className="text-sm text-muted-foreground flex items-center mt-1">
                  <Phone className="mr-2 h-4 w-4 shrink-0" />
                  {dealer.phone}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground">{t('noDealersFound')}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
