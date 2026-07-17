import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP_LINK = "https://wa.me/233549910292";

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-24">
    <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
    <div className="space-y-3 text-muted-foreground leading-relaxed">{children}</div>
  </section>
);

const Policies = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-muted/30 sticky top-0 z-40 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Kissel Food
          </Link>
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="gap-2">
              <MessageCircle className="w-4 h-4" /> WhatsApp us
            </Button>
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl space-y-12">
        <div>
          <h1 className="text-4xl font-black text-foreground mb-3">How We Work</h1>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about ordering from Kissel Food — payments, delivery,
            refunds and how we handle your details. Questions? Call or WhatsApp{" "}
            <a href="tel:+233549910292" className="text-primary font-medium">+233 54 991 0292</a>.
          </p>
        </div>

        <Section id="about" title="About Kissel Food">
          <p>
            Kissel Food is a Ghanaian kitchen in Kasoa–Fetteh Kakraba, adjacent KAAF University
            (Central Region). We cook jollof, fried rice, grilled and fried chicken, pizza and more —
            fresh to order, for pickup, delivery and dining in.
          </p>
        </Section>

        <Section id="ordering" title="Ordering & Payment">
          <p>
            Orders placed on this website are paid online through <strong>Paystack</strong>, which
            supports MTN Mobile Money, Telecel Cash, AT Money and bank cards. We never see or store
            your card or wallet details — payment happens on Paystack's secure system.
          </p>
          <p>
            Your order is confirmed only after payment is verified. You'll get a receipt with a
            tracking link so you can follow your order from <em>Pending</em> to <em>Ready</em> in
            real time.
          </p>
        </Section>

        <Section id="delivery" title="Delivery & Pickup">
          <p>
            <strong>Pickup</strong> is free — collect your order at the restaurant when the tracker
            shows it's ready.
          </p>
          <p>
            <strong>Delivery</strong> costs a flat ₵10 and covers Fetteh Kakraba and nearby areas
            around Kasoa. Please include a clear landmark in your delivery address. For locations
            further out, WhatsApp us first to confirm we can reach you.
          </p>
        </Section>

        <Section id="refunds" title="Refunds & Cancellations">
          <p>
            Need to cancel? Contact us <strong>immediately</strong> on{" "}
            <a href="tel:+233549910292" className="text-primary font-medium">+233 54 991 0292</a> with
            your order reference. If the kitchen hasn't started preparing your food, we'll cancel and
            refund you in full.
          </p>
          <p>
            Refunds are returned through Paystack to the same Mobile Money wallet or card you paid
            with, normally within 5–7 working days.
          </p>
          <p>
            If something is wrong with your order — a missing item, or food that arrived in poor
            condition — tell us within 2 hours of receiving it and we'll make it right with a
            replacement or a refund of the affected items.
          </p>
          <p>
            If you paid but never received an order confirmation, your money is safe: send us your
            payment reference on WhatsApp and we'll resolve it the same day.
          </p>
        </Section>

        <Section id="reservations" title="Reservations">
          <p>
            Table bookings are free and confirmed instantly with a reference number. If your plans
            change, call or WhatsApp us so we can release the table. We hold reserved tables for
            30 minutes past the booked time.
          </p>
        </Section>

        <Section id="privacy" title="Privacy">
          <p>
            We collect only what we need to serve you: your name, phone number, email and delivery
            address for orders and bookings. We use these to prepare and deliver your order, send
            your receipt, and contact you about it — nothing else.
          </p>
          <p>
            We never sell your information. Payments are processed by Paystack under their own
            security standards; we do not receive your card or wallet credentials. To have your
            details removed, message us on WhatsApp.
          </p>
        </Section>

        <Section id="terms" title="Terms of Service">
          <p>
            By ordering on this site you confirm the details you provide are accurate and the payment
            method is yours to use. Prices shown include the food only; delivery is charged
            separately at checkout. Menu items are subject to availability — if we can't fulfil part
            of a paid order, we'll contact you to substitute or refund it.
          </p>
          <p>
            Ordering hours are shown at checkout. Orders placed outside those hours are not accepted
            and are not charged.
          </p>
        </Section>

        <div className="border-t border-border pt-8 text-sm text-muted-foreground">
          Kissel Food · Fetteh Kakraba, adjacent KAAF University, Kasoa, Central Region, Ghana ·{" "}
          <a href="tel:+233549910292" className="text-primary">+233 54 991 0292</a> ·{" "}
          <a href="mailto:info@kisselfood.com" className="text-primary">info@kisselfood.com</a>
        </div>
      </main>
    </div>
  );
};

export default Policies;
