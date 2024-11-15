import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSharedState } from "../MyContext";

export default function AdminContent() {
  const [tableData, setTableData] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [matchedUserCount, setMatchedUserCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const { isLoggedIn, setIsLoggedIn } = useSharedState();

  const fetchData = async () => {
    const admin_token = localStorage.getItem("admin_token");
    const response = await fetch(`${import.meta.env.VITE_SERVER_IP_AND_PORT}/user-matches`, {
      headers: {
        admin_token: admin_token,
      },
    });
    const data = await response.json();
    setTableData(data);
    setUserCount(data.length);
    setMatchedUserCount(data.filter((item) => item.matchedUsername).length);

    setUserCount(data.filter((match) => match.username).length);
    setMatchedUserCount(
      data.filter((match) => Boolean(match.matchedUsername)).length
    );
  };

  const runMatchingSequence = async () => {
    const admin_token = localStorage.getItem("admin_token");
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_SERVER_IP_AND_PORT}/match-users`, {
        method: "POST",
        headers: {
          admin_token: admin_token,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setTableData(data);
      setUserCount(data.length);
      setMatchedUserCount(data.filter((item) => item.matchedUsername).length);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (isLoggedIn) {
      localStorage.removeItem("admin_token");
      window.location.reload(true); // Refreshes the current page, same as clicking the refresh button in your browser
    }
  };

  useEffect(() => {
    fetchData();
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div>
        <div className="flex flex-row justify-between items-end mb-4">
          <div className="flex flex-row items-end">
            <h1 className="text-xl md:text-6xl font-bold  mr-12">
              {matchedUserCount * 2}/{userCount + matchedUserCount} users
              matched
            </h1>

            <Button
              onClick={runMatchingSequence}
              className="text-sm md:text-xl bg-transparent text-white border border-white hover:bg-white hover:text-black transition-colors"
              disabled={loading}
            >
              {loading ? "Loading..." : "Run Matching Sequence"}
            </Button>
          </div>

          <Button
            className="self-end justify-self-end text-white border border-white hover:bg-white hover:text-black transition-colors"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow>
              <TableHead className="border border-white p-2 text-left w-1/5 text-zinc-200 text-xl font-bold ">
                User
              </TableHead>
              <TableHead className="border border-white p-2 text-left w-1/5 text-zinc-200 text-xl font-bold">
                Matched User
              </TableHead>
              <TableHead className="border border-white p-2 text-left w-3/5 text-zinc-200 text-xl font-bold">
                Reason
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.length > 0 ? (
              tableData.map((item, i) => (
                <TableRow key={i}>
                  <TableCell className="border border-white p-2 w-1/5">
                    {item.username}
                  </TableCell>
                  <TableCell className="border border-white p-2 w-1/5">
                    {item.matchedUsername}
                  </TableCell>
                  <TableCell className="border border-white p-2 w-3/5">
                    {item.reason}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="border border-white p-2 w-full text-center"
                  colSpan="3"
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
