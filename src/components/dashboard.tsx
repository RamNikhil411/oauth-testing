import React from "react";
import { useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import TanStackTable from "../components/core/TanstackTable";
import { DocsColumns } from "../components/core/DocsColumns";

const Dashboard = () => {
  const { user_id } = useSearch({ from: "/dashboard" });

  const { data: userData, isLoading, isError } = useQuery({
    queryKey: ["user", user_id],
    queryFn: async () => {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      const res = await fetch(
        `https://v2-dev-api.esigns.io/v1.0/workspaces/current?user_id=${user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }

      return res.json();
    },
    enabled: !!user_id,
  });

  const company_id = userData?.data?.workspace_id;

  const { data: documentsData, isLoading: docsLoading } = useQuery({
    queryKey: ["documents", company_id],
    queryFn: async () => {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      const res = await fetch(
        `https://v2-dev-api.esigns.io/v1.0/api/company-document-responses-v2?company_id=${company_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch documents");
      }

      return res.json();
    },
    enabled: !!company_id,
  });

  if (isLoading) return <p className="p-4">🔄 Loading...</p>;
  if (isError) return <p className="p-4  text-red-600">❌ Error fetching user</p>;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">📄 Document List</h2>
      <TanStackTable data={documentsData?.data || []} columns={DocsColumns} />
    </div>
  );
};

export default Dashboard;
