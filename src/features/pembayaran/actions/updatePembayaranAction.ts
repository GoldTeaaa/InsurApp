type State = {
  success: boolean;
  message: string;
};

export default async function updatePembayaranAction(
  id: string,
  prevState: State,
  formData: FormData
): Promise<State> {
  console.log("Updated Pembayaran Data:", formData);

  return {
    success: true,
    message: "Pembayaran updated successfully.",
  };
}
