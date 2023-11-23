"use client";
import { signIn, signOut, useSession } from "next-auth/react";

interface Props {
  className: string;
}
export const AuthButton = ({ className }: Props) => {
  const { data: session } = useSession();
  return (
    <div className={className}>
      {session?.user ? (
        <button onClick={() => signOut()}>Sign Out</button>
      ) : (
        <button onClick={() => signIn()}>Sign In</button>
      )}
    </div>
  );
};
