import UserBioForm from "@/components/userBioForm";
const Bio = () => {
  return (
    <div className="BioFormWrapper flex flex-col md:flex-row bg-zinc-950 h-auto w-full justify-center p-2">
      <UserBioForm></UserBioForm>
    </div>
  );
};

export default Bio;
