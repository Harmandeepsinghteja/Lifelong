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
  const { isLoggedIn, setIsLoggedIn } = useSharedState();

  const fetchData = async () => {
    const adminToken = localStorage.getItem("adminToken");
    const response = await fetch("http://localhost:3000/user-matches", {
      headers: {
        adminToken: adminToken,
      },
    });
    const data = await response.json();
    setTableData(data);
    setUserCount(data.length);
    setMatchedUserCount(data.filter((item) => item.matchedUsername).length);
    console.log(data);

    console.log(userCount);
    console.log(matchedUserCount);
  };

  const handleLogout = () => {
    if (!isLoggedIn) {
      localStorage.removeItem("adminToken");
      window.location.reload(true); // Refreshes the current page, same as clicking the refresh button in your browser
    }
  };

  useEffect(() => {
    fetchData();
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div>
        <div className="flex flex-row items-end mb-4">
          <h1 className="text-xl md:text-6xl font-bold  mr-12">
            {matchedUserCount}/{userCount} users matched
          </h1>
          <div>

            <span onClick={handleLogout}>Log out</span>
          </div>

          <Button
            onClick={fetchData}
            className=" text-sm md:text-xl  bg-transparent text-white border border-white hover:bg-white hover:text-black transition-colors"
          >
            Run Matching Sequence
          </Button>
        </div>
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow>
              <TableHead className="border border-white p-2 text-left w-1/5">
                User
              </TableHead>
              <TableHead className="border border-white p-2 text-left w-1/5">
                Matched User
              </TableHead>
              <TableHead className="border border-white p-2 text-left w-3/5">
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