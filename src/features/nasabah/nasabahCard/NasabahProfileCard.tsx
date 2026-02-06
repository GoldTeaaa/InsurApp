import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NasabahProfileCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Nasabah profile information</CardDescription>
      </CardHeader>
      <CardContent>{/* Profile content */}</CardContent>
    </Card>
  );
}