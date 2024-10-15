import TypeMessageBox from "@/components/TypeMessageBox";
import MessageLog from "@/components/MessageLog";

export default function Chat() {
  return (
    <div className="ChatPageWrapper w-full flex flex-col flex-1  align-top  bg-zinc-950 ">
      <div className="ChatWrapper flex flex-col flex-1 ">
        <MessageLog messages />
        <TypeMessageBox onSendMessage />
      </div>
    </div>
  );
}
