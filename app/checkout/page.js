import dynamic from "next/dynamic";

// Dynamically import the checkout component with ssr disabled
const CheckoutPageContent = dynamic(
  () => import("@/components/CheckoutPageContent"),
  { ssr: false }
);

// Main page component
export default function CheckoutPage() {
  return <CheckoutPageContent />;
}
