"use client";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ShowCLIToken = () => {
  const { getToken } = useAuth();
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      const t = await getToken();
      setToken(t || "");
    }
    fetchToken();
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("copied")
  };

  return (
    <div>
      <span onClick={handleCopy} style={{ marginBottom: 8 }} className=" cursor-pointer px-2 py-1  text-sm rounded-md bg-[var(--button-gradient)]">
        Token
      </span>
    </div>
  );
}
export default ShowCLIToken;