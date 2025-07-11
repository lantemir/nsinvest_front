import { Suspense } from "react";
import VerifyEmailComponent from "./verifyEmailComponent";

export default function Page() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <VerifyEmailComponent />
    </Suspense>
  );
}