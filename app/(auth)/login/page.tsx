import { Suspense } from "react";
import LoginComponent from "./loginComponent";

export default function Page() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <LoginComponent />
    </Suspense>
  );
}