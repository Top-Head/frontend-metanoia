import type { Metadata } from "next";
import SelectUserRole from "@/components/auth/select-role";

export const metadata: Metadata = {
  title: "Escolha seu Perfil",
  description: "Defina como você quer usar a Academia Metanoia.",
};

export default function SelectRolePage() {
  return (
    <>
      <SelectUserRole />
    </>
  );
}