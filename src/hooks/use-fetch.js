import { useSession } from "@clerk/clerk-react";
import { useState } from "react";

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { session } = useSession();

  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      // 🔥 IMPORTANT: session ready check
      if (!session) {
        throw new Error("Clerk session not ready");
      }

      // 🔥 Clerk JWT (Supabase template)
      const supabaseAccessToken = await session.getToken({
        template: "supabase",
      });

      if (!supabaseAccessToken) {
        throw new Error("Supabase access token is null");
      }

      // 🔥 API call
      const response = await cb(
        supabaseAccessToken,
        options,
        ...args
      );

      setData(response);
      return response;
    } catch (err) {
      console.error("useFetch error:", err);
      setError(err);
      throw err;
      
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
};

export default useFetch;


