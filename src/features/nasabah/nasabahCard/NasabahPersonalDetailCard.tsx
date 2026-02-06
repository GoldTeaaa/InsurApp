import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NasabahPersonalDetailCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Details</CardTitle>
        <CardDescription>Nasabah personal details</CardDescription>
      </CardHeader>
      <CardContent>{/* Personal details content */}</CardContent>
    </Card>
  );
}