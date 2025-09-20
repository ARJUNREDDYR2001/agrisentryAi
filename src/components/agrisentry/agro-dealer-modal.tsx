import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin, Phone } from "lucide-react";

const dealers = [
  { name: 'Kisan Kendra', address: '123, Market Road, Pune', phone: '9876543210' },
  { name: 'Farm Essentials', address: '45, Agri Chowk, Nashik', phone: '9876543211' },
  { name: 'Green Growth Agro', address: '78, Village Main St, Baramati', phone: '9876543212' },
];

export default function AgroDealerModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          <MapPin className="mr-2 h-4 w-4" /> Find Nearest Agro-Dealers
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-primary">Nearby Agro-Dealers</DialogTitle>
          <DialogDescription>
            Contact these dealers for supplies and support.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {dealers.map((dealer, index) => (
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
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
